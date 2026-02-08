import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async createLog(data: {
        userId: string;
        action: string;
        ipAddress?: string;
        userAgent?: string;
        metadata?: any;
    }) {
        return this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                metadata: data.metadata,
            },
        });
    }

    async findAll(options?: { userId?: string; limit?: number; offset?: number }) {
        return this.prisma.auditLog.findMany({
            where: options?.userId ? { userId: options.userId } : undefined,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: options?.limit || 50,
            skip: options?.offset || 0,
        });
    }

    async count(userId?: string) {
        return this.prisma.auditLog.count({
            where: userId ? { userId } : undefined,
        });
    }
}
