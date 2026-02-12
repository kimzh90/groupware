import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async findByBoard(boardId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where: { boardId },
                include: {
                    author: {
                        select: { id: true, name: true, position: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where: { boardId } }),
        ]);

        return { posts, total, page, limit };
    }

    async findOne(id: string) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, position: true, department: true },
                },
                board: true,
            },
        });

        if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다.');

        // 조회수 증가
        await this.prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        return { ...post, views: post.views + 1 };
    }

    async create(data: { title: string; content: string; boardId: string; authorId: string }) {
        return this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                boardId: data.boardId,
                authorId: data.authorId,
            },
            include: {
                author: {
                    select: { id: true, name: true, position: true },
                },
            },
        });
    }

    async update(id: string, data: { title?: string; content?: string }) {
        return this.prisma.post.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.post.delete({
            where: { id },
        });
    }
}
