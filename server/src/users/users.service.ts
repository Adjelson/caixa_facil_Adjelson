import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async onModuleInit() {
    // Seed roles/permissions and default users if not present
    const permissionActions = [
      "sale.create",
      "sale.view",
      "product.view",
      "product.create",
      "product.update",
      "product.delete",
      "cash.open",
      "cash.close",
      "cash.view",
      "user.manage",
      "user.manage.staff",
    ];

    const permissionsMap: Record<string, Permission> = {};
    for (const action of permissionActions) {
      let permission = await this.permissionsRepository.findOne({
        where: { action },
      });
      if (!permission) {
        permission = this.permissionsRepository.create({
          action,
          description: action,
        });
        permission = await this.permissionsRepository.save(permission);
      }
      permissionsMap[action] = permission;
    }

    const roleDefinitions: {
      name: string;
      description: string;
      permissions: string[];
    }[] = [
      {
        name: "admin",
        description: "Administrador",
        permissions: permissionActions,
      },
      {
        name: "manager",
        description: "Gerente",
        permissions: [
          "sale.create",
          "sale.view",
          "product.view",
          "product.create",
          "product.update",
          "cash.open",
          "cash.close",
          "cash.view",
          "user.manage",
          "user.manage.staff",
        ],
      },
      {
        name: "cashier",
        description: "Operador de caixa",
        permissions: [
          "sale.create",
          "sale.view",
          "product.view",
          "cash.open",
          "cash.close",
          "cash.view",
        ],
      },
    ];

    const seededRoles: Record<string, Role> = {};
    for (const definition of roleDefinitions) {
      let role = await this.rolesRepository.findOne({
        where: { name: definition.name },
        relations: ["permissions"],
      });

      const rolePermissions = definition.permissions.map(
        (p) => permissionsMap[p],
      );

      if (!role) {
        role = this.rolesRepository.create({
          name: definition.name,
          description: definition.description,
          permissions: rolePermissions,
        });
      } else {
        role.permissions = rolePermissions;
      }
      role = await this.rolesRepository.save(role);
      seededRoles[definition.name] = role;
    }

    const existingAdmin = await this.usersRepository.findOne({
      where: { username: "admin" },
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminUser = this.usersRepository.create({
        name: "Administrador",
        username: "admin",
        password: hashedPassword,
        roles: [seededRoles["admin"]],
      });
      await this.usersRepository.save(adminUser);
      this.logger.log("Usuário admin padrão criado (admin / admin123)");
    }

    const existingManager = await this.usersRepository.findOne({
      where: { username: "manager" },
    });
    if (!existingManager) {
      const hashedPassword = await bcrypt.hash("manager123", 10);
      const managerUser = this.usersRepository.create({
        name: "Gerente",
        username: "manager",
        password: hashedPassword,
        roles: [seededRoles["manager"]],
      });
      await this.usersRepository.save(managerUser);
      this.logger.log("Usuário manager padrão criado (manager / manager123)");
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    // Password column is marked with `select: false` in the entity.
    // Use QueryBuilder to explicitly include the password when fetching for authentication.
    return this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.roles", "roles")
      .leftJoinAndSelect("roles.permissions", "permissions")
      .where("user.username = :username", { username })
      .getOne();
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ["roles", "roles.permissions"],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["roles", "roles.permissions"],
    });
    if (!user) throw new NotFoundException("Utilizador não encontrado");
    return user;
  }

  async create(createUserDto: CreateUserDto, actor: User): Promise<User> {
    const roles = await this.loadRoles(createUserDto.roleIds);
    this.ensureRoleAssignmentIsAllowed(actor, roles);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      name: createUserDto.name,
      username: createUserDto.username,
      password: hashedPassword,
      isActive: createUserDto.isActive ?? true,
      roles,
    });
    return this.usersRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    actor: User,
  ): Promise<User> {
    const user = await this.findOne(id);
    const isTargetAdmin = user.roles.some((r) => r.name === "admin");
    const isActorAdmin = actor.roles?.some((r) => r.name === "admin");
    if (isTargetAdmin && !isActorAdmin) {
      throw new BadRequestException(
        "Apenas administradores podem alterar administradores",
      );
    }
    if (updateUserDto.roleIds) {
      const roles = await this.loadRoles(updateUserDto.roleIds);
      this.ensureRoleAssignmentIsAllowed(actor, roles);
      user.roles = roles;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.name !== undefined) user.name = updateUserDto.name;
    if (updateUserDto.username !== undefined)
      user.username = updateUserDto.username;
    if (updateUserDto.isActive !== undefined)
      user.isActive = updateUserDto.isActive;

    return this.usersRepository.save(user);
  }

  async remove(id: number, actor: User): Promise<void> {
    const user = await this.findOne(id);
    // Prevent deleting admin if actor is not admin
    const isTargetAdmin = user.roles.some((r) => r.name === "admin");
    const isActorAdmin = actor.roles.some((r) => r.name === "admin");
    if (isTargetAdmin && !isActorAdmin) {
      throw new BadRequestException(
        "Apenas administradores podem remover administradores",
      );
    }
    await this.usersRepository.delete(id);
  }

  async listRoles(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ["permissions"] });
  }

  private async loadRoles(roleIds: number[]): Promise<Role[]> {
    if (!roleIds || roleIds.length === 0) {
      throw new BadRequestException(
        "É necessário informar pelo menos um perfil",
      );
    }
    const roles = await this.rolesRepository.find({
      where: roleIds.map((id) => ({ id })),
    });
    if (roles.length !== roleIds.length) {
      throw new BadRequestException("Perfil inválido informado");
    }
    return roles;
  }

  private ensureRoleAssignmentIsAllowed(actor: User, rolesToAssign: Role[]) {
    const isActorAdmin = actor.roles?.some((r) => r.name === "admin");
    if (isActorAdmin) return;

    const assignsAdmin = rolesToAssign.some((r) => r.name === "admin");
    if (assignsAdmin) {
      throw new BadRequestException(
        "Somente administradores podem atribuir perfil de administrador",
      );
    }

    const hasManagePermission = actor.roles?.some((role) =>
      role.permissions?.some((p) => p.action === "user.manage"),
    );
    if (!hasManagePermission) {
      throw new BadRequestException("Sem permissão para gerir utilizadores");
    }
  }
}
