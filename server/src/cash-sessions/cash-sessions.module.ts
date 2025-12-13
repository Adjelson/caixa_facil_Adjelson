import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CashSessionsService } from "./cash-sessions.service";
import { CashSessionsController } from "./cash-sessions.controller";
import { CashSession } from "./entities/cash-session.entity";
import { CashMovement } from "./entities/cash-movement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CashSession, CashMovement])],
  controllers: [CashSessionsController],
  providers: [CashSessionsService],
  exports: [CashSessionsService],
})
export class CashSessionsModule {}
