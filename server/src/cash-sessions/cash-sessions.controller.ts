import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequirePermission } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { CashSessionsService } from "./cash-sessions.service";
import { CreateCashSessionDto } from "./dto/create-cash-session.dto";
import { UpdateCashSessionDto } from "./dto/update-cash-session.dto";

type RequestWithUser = { user: { userId: number } };

@Controller("cash-sessions")
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
export class CashSessionsController {
  constructor(private readonly cashSessionsService: CashSessionsService) {}

  @Post()
  @RequirePermission("cash.open")
  create(
    @Body() createCashSessionDto: CreateCashSessionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.cashSessionsService.create(
      req.user.userId,
      createCashSessionDto,
    );
  }

  @Get("open")
  @RequirePermission("cash.view")
  findOpen(@Request() req: RequestWithUser) {
    return this.cashSessionsService.findOpenByUser(req.user.userId);
  }

  @Get()
  @RequirePermission("cash.view")
  findAll() {
    return this.cashSessionsService.findAll();
  }

  @Get(":id")
  @RequirePermission("cash.view")
  findOne(@Param("id") id: string) {
    return this.cashSessionsService.findOne(+id);
  }

  @Patch(":id/close")
  @RequirePermission("cash.close")
  close(
    @Param("id") id: string,
    @Body() updateCashSessionDto: UpdateCashSessionDto,
  ) {
    return this.cashSessionsService.close(+id, updateCashSessionDto);
  }

  @Delete(":id")
  @RequirePermission("cash.close")
  remove(@Param("id") id: string) {
    return this.cashSessionsService.remove(+id);
  }
}
