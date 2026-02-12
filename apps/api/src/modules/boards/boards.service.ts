import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BoardsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.board.findMany({
            include: {
                _count: { select: { posts: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.board.findUnique({
            where: { id },
        });
    }

    async create(data: { name: string; type?: string }) {
        return this.prisma.board.create({
            data: {
                name: data.name,
                type: (data.type as any) || 'GENERAL',
            },
        });
    }
}
