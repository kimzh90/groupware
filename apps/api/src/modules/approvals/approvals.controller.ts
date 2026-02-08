import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Put,
} from "@nestjs/common";
import { ApprovalsService } from "./approvals.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("approvals")
@UseGuards(JwtAuthGuard)
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @Post()
  async create(@Request() req: any, @Body() data: any) {
    return this.approvalsService.create(req.user.userId, data);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.approvalsService.findAll(req.user.userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.approvalsService.findOne(id);
  }

  @Put(":id/process")
  async process(
    @Request() req: any,
    @Param("id") id: string,
    @Body() body: { action: "APPROVE" | "REJECT"; comment?: string },
  ) {
    return this.approvalsService.process(
      req.user.userId,
      id,
      body.action,
      body.comment,
    );
  }
}
