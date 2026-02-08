import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { AuditService } from '../audit/audit.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private auditService: AuditService,
    ) { }

    @Get('stats')
    async getStats() {
        return this.adminService.getStats();
    }

    @Get('logs')
    async getLogs(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.auditService.findAll({
            limit: limit ? parseInt(limit, 10) : 50,
            offset: offset ? parseInt(offset, 10) : 0,
        });
    }
}
