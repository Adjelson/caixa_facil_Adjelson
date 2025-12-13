import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "./permissions.decorator";
import { Role } from "../users/entities/role.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermission) {
      return true;
    }
    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { roles?: Role[] } }>();

    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    const hasPermission = user.roles.some((role) =>
      role.permissions?.some(
        (permission) => permission.action === requiredPermission,
      ),
    );
    return hasPermission;
  }
}
