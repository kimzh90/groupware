import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
    constructor(private boardsService: BoardsService) { }

    @Get()
    async findAll() {
        return this.boardsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.boardsService.findOne(id);
    }

    @Post()
    async create(@Body() data: { name: string; type?: string }) {
        return this.boardsService.create(data);
    }
}
