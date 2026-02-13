import { Module } from '@nestjs/common';
import { ApprovalTemplatesController } from './approval-templates.controller';
import { ApprovalTemplatesService } from './approval-templates.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ApprovalTemplatesController],
    providers: [ApprovalTemplatesService],
    exports: [ApprovalTemplatesService],
})
export class ApprovalTemplatesModule { }
