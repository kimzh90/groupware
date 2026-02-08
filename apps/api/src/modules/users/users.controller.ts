import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Param,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() data: any) {
    // In a real app, we would check if the requester is an ADMIN
    return this.usersService.create(data);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('departmentId') departmentId?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll({ search, departmentId, role });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.SUPER_ADMIN)
  async update(@Param("id") id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }
}
