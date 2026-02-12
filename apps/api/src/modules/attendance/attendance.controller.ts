import { Controller, Post, Get, Query, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
    constructor(private attendanceService: AttendanceService) { }

    @Post('clock-in')
    async clockIn(@Req() req: Request) {
        const userId = (req as any).user.userId;
        return this.attendanceService.clockIn(userId);
    }

    @Post('clock-out')
    async clockOut(@Req() req: Request) {
        const userId = (req as any).user.userId;
        return this.attendanceService.clockOut(userId);
    }

    @Get('today')
    async getTodayStatus(@Req() req: Request) {
        const userId = (req as any).user.userId;
        return this.attendanceService.getTodayStatus(userId);
    }

    @Get('my')
    async getMyAttendance(
        @Req() req: Request,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const userId = (req as any).user.userId;
        return this.attendanceService.getMyAttendance(
            userId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get()
    async findAll(
        @Query('date') date?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.attendanceService.findAll({
            date,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 50,
        });
    }
}
