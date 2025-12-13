import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCashSessionDto } from "./dto/create-cash-session.dto";
import { UpdateCashSessionDto } from "./dto/update-cash-session.dto";
import { CashSession, SessionStatus } from "./entities/cash-session.entity";

@Injectable()
export class CashSessionsService {
  constructor(
    @InjectRepository(CashSession)
    private readonly sessionsRepository: Repository<CashSession>,
  ) {}

  async create(
    userId: number,
    createCashSessionDto: CreateCashSessionDto,
  ): Promise<CashSession> {
    if (!userId) {
      throw new BadRequestException("Utilizador não autenticado");
    }
    const existing = await this.sessionsRepository.findOne({
      where: { userId, status: SessionStatus.OPEN },
    });
    if (existing) {
      throw new BadRequestException(
        "Já existe uma sessão de caixa aberta para este utilizador",
      );
    }

    const session = this.sessionsRepository.create({
      userId,
      openingBalance: createCashSessionDto.openingBalance ?? 0,
      notes: createCashSessionDto.notes,
      status: SessionStatus.OPEN,
      openedAt: new Date(),
    });

    return this.sessionsRepository.save(session);
  }

  findAll(): Promise<CashSession[]> {
    return this.sessionsRepository.find({ relations: ["movements"] });
  }

  async findOne(id: number): Promise<CashSession> {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ["movements"],
    });
    if (!session) {
      throw new NotFoundException(`Sessão de caixa #${id} não encontrada`);
    }
    return session;
  }

  findOpenByUser(userId: number): Promise<CashSession | null> {
    return this.sessionsRepository.findOne({
      where: { userId, status: SessionStatus.OPEN },
    });
  }

  async close(
    id: number,
    updateCashSessionDto: UpdateCashSessionDto,
  ): Promise<CashSession> {
    const session = await this.findOne(id);
    if (session.status === SessionStatus.CLOSED) {
      throw new BadRequestException("Sessão já está fechada");
    }

    session.status = SessionStatus.CLOSED;
    session.closingBalance =
      updateCashSessionDto.closingBalance ?? session.closingBalance ?? 0;
    session.closedAt = new Date();
    if (updateCashSessionDto.notes !== undefined) {
      session.notes = updateCashSessionDto.notes;
    }

    return this.sessionsRepository.save(session);
  }

  async remove(id: number): Promise<void> {
    await this.sessionsRepository.delete(id);
  }
}
