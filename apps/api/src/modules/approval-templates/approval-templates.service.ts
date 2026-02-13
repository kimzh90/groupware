import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalTemplatesService {
    constructor(private prisma: PrismaService) { }

    /** 양식 생성 (관리자) */
    async create(data: { name: string; description?: string; content: string; creatorId: string }) {
        return this.prisma.approvalTemplate.create({
            data: {
                name: data.name,
                description: data.description,
                content: data.content,
                creatorId: data.creatorId,
            },
            include: { creator: { select: { id: true, name: true, position: true } } },
        });
    }

    /** 양식 목록 조회 (활성 양식만 / 관리자는 전체) */
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.prisma.approvalTemplate.findMany({
            where,
            include: { creator: { select: { id: true, name: true, position: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    /** 양식 상세 조회 */
    async findOne(id: string) {
        const template = await this.prisma.approvalTemplate.findUnique({
            where: { id },
            include: { creator: { select: { id: true, name: true, position: true } } },
        });
        if (!template) throw new NotFoundException('양식을 찾을 수 없습니다.');
        return template;
    }

    /** 양식 수정 (관리자) */
    async update(id: string, data: { name?: string; description?: string; content?: string; isActive?: boolean }) {
        await this.findOne(id); // 존재 확인
        return this.prisma.approvalTemplate.update({
            where: { id },
            data,
            include: { creator: { select: { id: true, name: true, position: true } } },
        });
    }

    /** 양식 삭제 (관리자) */
    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.approvalTemplate.delete({ where: { id } });
    }
}
