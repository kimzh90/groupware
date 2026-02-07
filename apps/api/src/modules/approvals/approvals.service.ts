import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApprovalStatus } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    const { title, content, approverIds } = data;

    return this.prisma.approval.create({
      data: {
        title,
        content,
        requesterId: userId,
        status: ApprovalStatus.PENDING,
        lines: {
          create: approverIds.map((approverId: string, index: number) => ({
            approverId,
            step: index + 1,
            status: index === 0 ? ApprovalStatus.PENDING : ApprovalStatus.DRAFT,
          })),
        },
      },
      include: {
        lines: true,
      },
    });
  }

  async process(userId: string, approvalId: string, action: 'APPROVE' | 'REJECT', comment?: string) {
    const approval = await this.prisma.approval.findUnique({
      where: { id: approvalId },
      include: { lines: { orderBy: { step: 'asc' } } },
    });

    if (!approval) throw new BadRequestException('Approval not found');

    const currentLine = approval.lines.find(
      (line) => line.status === ApprovalStatus.PENDING && line.approverId === userId,
    );

    if (!currentLine) throw new BadRequestException('No pending approval for this user');

    const newStatus = action === 'APPROVE' ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED;

    await this.prisma.approvalLine.update({
      where: { id: currentLine.id },
      data: { status: newStatus, comment },
    });

    if (action === 'REJECT') {
      await this.prisma.approval.update({
        where: { id: approvalId },
        data: { status: ApprovalStatus.REJECTED },
      });
    } else {
      // Find next step
      const nextLine = approval.lines.find((line) => line.step === currentLine.step + 1);
      if (nextLine) {
        await this.prisma.approvalLine.update({
          where: { id: nextLine.id },
          data: { status: ApprovalStatus.PENDING },
        });
      } else {
        // All steps approved
        await this.prisma.approval.update({
          where: { id: approvalId },
          data: { status: ApprovalStatus.APPROVED },
        });
      }
    }

    return { message: `Approval ${action.toLowerCase()}d successfully` };
  }

  async findAll(userId: string) {
    return this.prisma.approval.findMany({
      where: {
        OR: [{ requesterId: userId }, { lines: { some: { approverId: userId } } }],
      },
      include: {
        requester: { select: { name: true } },
        lines: { include: { approver: { select: { name: true } } } },
      },
    });
  }
}
