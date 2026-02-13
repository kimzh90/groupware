import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApprovalTemplatesService } from './approval-templates.service';

@Controller('approval-templates')
@UseGuards(JwtAuthGuard)
export class ApprovalTemplatesController {
    constructor(private readonly service: ApprovalTemplatesService) { }

    /** 양식 생성 (관리자 전용) */
    @Post()
    @UseGuards(RolesGuard)
    @Roles('SUPER_ADMIN', 'ADMIN')
    async create(@Body() body: { name: string; description?: string; content: string }, @Req() req: any) {
        return this.service.create({ ...body, creatorId: req.user.id });
    }

    /** 양식 목록 조회 (전체 사용자 접근 가능, 관리자는 비활성 포함) */
    @Get()
    async findAll(@Req() req: any, @Query('all') all?: string) {
        const includeInactive = all === 'true' && ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);
        return this.service.findAll(includeInactive);
    }

    /** 양식 상세 조회 */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    /** 양식 수정 (관리자 전용) */
    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('SUPER_ADMIN', 'ADMIN')
    async update(@Param('id') id: string, @Body() body: { name?: string; description?: string; content?: string; isActive?: boolean }) {
        return this.service.update(id, body);
    }

    /** 양식 삭제 (관리자 전용) */
    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('SUPER_ADMIN', 'ADMIN')
    async remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
