import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [totalUsers, totalApprovals, pendingApprovals, todayLogins, weeklyLogins] = await Promise.all([
            // Total users
            this.prisma.user.count(),

            // Total approvals
            this.prisma.approvalDoc.count(),

            // Pending approvals
            this.prisma.approvalDoc.count({
                where: { status: 'PENDING' },
            }),

            // Today's logins (unique users)
            this.getTodayLogins(),

            // Weekly login data
            this.getWeeklyLogins(),
        ]);

        return {
            totalUsers,
            totalApprovals,
            pendingApprovals,
            todayLogins,
            weeklyLoginData: weeklyLogins,
        };
    }

    private async getTodayLogins() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const logs = await this.prisma.auditLog.findMany({
            where: {
                action: 'LOGIN',
                createdAt: { gte: today },
            },
            distinct: ['userId'],
        });

        return logs.length;
    }

    private async getWeeklyLogins() {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const logs = await this.prisma.auditLog.findMany({
            where: {
                action: 'LOGIN',
                createdAt: { gte: sevenDaysAgo },
            },
        });

        // Group by day
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dataByDay: Record<string, number> = {};

        logs.forEach((log) => {
            const dayName = dayNames[log.createdAt.getDay()];
            dataByDay[dayName] = (dataByDay[dayName] || 0) + 1;
        });

        // Return array format for chart
        return dayNames.map((day) => ({
            day,
            count: dataByDay[day] || 0,
        }));
    }
}
