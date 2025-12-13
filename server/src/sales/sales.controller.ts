import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RequirePermission } from "../auth/permissions.decorator";
import { PermissionsGuard } from "../auth/permissions.guard";
import { SalesService } from "./sales.service";
import { CreateSaleDto } from "./dto/create-sale.dto";
import type { Request } from "express";

type RequestWithUser = Request & { user: { userId: number } };

@Controller("sales")
@UseGuards(AuthGuard("jwt"), PermissionsGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @RequirePermission("sale.create")
  create(@Body() createSaleDto: CreateSaleDto, @Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    return this.salesService.create(createSaleDto, userId);
  }

  @Get()
  @RequirePermission("sale.view")
  findAll() {
    return this.salesService.findAll();
  }

  @Get(":id")
  @RequirePermission("sale.view")
  findOne(@Param("id") id: string) {
    return this.salesService.findOne(+id);
  }
}
