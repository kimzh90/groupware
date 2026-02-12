import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    private getToday(): Date {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    async clockIn(userId: string) {
        const today = this.getToday();
        const existing = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (existing?.clockIn) {
            throw new BadRequestException('이미 출근 처리되었습니다.');
        }

        const now = new Date();
        const hour = now.getHours();
        const status = hour >= 9 ? 'LATE' : 'NORMAL';

        return this.prisma.attendance.upsert({
            where: { userId_date: { userId, date: today } },
            update: { clockIn: now, status: status as any },
            create: {
                userId,
                date: today,
                clockIn: now,
                status: status as any,
            },
        });
    }

    async clockOut(userId: string) {
        const today = this.getToday();
        const existing = await this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });

        if (!existing?.clockIn) {
            throw new BadRequestException('먼저 출근 처리를 해주세요.');
        }

        if (existing?.clockOut) {
            throw new BadRequestException('이미 퇴근 처리되었습니다.');
        }

        const now = new Date();
        const hour = now.getHours();
        const status = hour < 18 ? 'EARLY_LEAVE' : existing.status;

        return this.prisma.attendance.update({
            where: { userId_date: { userId, date: today } },
            data: { clockOut: now, status: status as any },
        });
    }

    async getMyAttendance(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            this.prisma.attendance.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.attendance.count({ where: { userId } }),
        ]);

        return { records, total, page, limit };
    }

    async getTodayStatus(userId: string) {
        const today = this.getToday();
        return this.prisma.attendance.findUnique({
            where: { userId_date: { userId, date: today } },
        });
    }

    async findAll(options?: { date?: string; page?: number; limit?: number }) {
        const where: any = {};
        if (options?.date) {
            where.date = new Date(options.date);
        }

        const page = options?.page || 1;
        const limit = options?.limit || 50;
        const skip = (page - 1) * limit;

        const [records, total] = await Promise.all([
            this.prisma.attendance.findMany({
                where,
                include: {
                    user: {
                        select: { id: true, name: true, employeeId: true, position: true, department: true },
                    },
                },
                orderBy: { date: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.attendance.count({ where }),
        ]);

        return { records, total, page, limit };
    }
}
