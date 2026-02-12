import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get('board/:boardId')
    async findByBoard(
        @Param('boardId') boardId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.postsService.findByBoard(
            boardId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Post()
    async create(
        @Body() data: { title: string; content: string; boardId: string },
        @Req() req: Request,
    ) {
        const userId = (req as any).user.userId;
        return this.postsService.create({ ...data, authorId: userId });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: { title?: string; content?: string }) {
        return this.postsService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.postsService.delete(id);
    }
}
