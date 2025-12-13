/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermission } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Request } from 'express';
import { User } from './entities/user.entity';

type RequestWithUser = Request & { user: User };

@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermission('user.manage')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @RequirePermission('user.manage')
  listRoles() {
    return this.usersService.listRoles();
  }

  @Post()
  @RequirePermission('user.manage')
  create(@Body() createUserDto: CreateUserDto, @Req() req: RequestWithUser) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get(':id')
  @RequirePermission('user.manage')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermission('user.manage')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  @RequirePermission('user.manage')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.usersService.remove(+id, req.user);
  }
}
