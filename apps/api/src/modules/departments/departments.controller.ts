import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("departments")
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get("tree")
  async getTree() {
    return this.departmentsService.getTree();
  }

  @Get()
  async findAll() {
    return this.departmentsService.findAll();
  }

  @Post()
  async create(@Body() data: any) {
    return this.departmentsService.create(data);
  }
}
