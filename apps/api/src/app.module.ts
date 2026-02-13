import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DepartmentsModule } from "./modules/departments/departments.module";
import { ApprovalsModule } from "./modules/approvals/approvals.module";
import { BoardsModule } from "./modules/boards/boards.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { ApprovalTemplatesModule } from "./modules/approval-templates/approval-templates.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    DepartmentsModule,
    ApprovalsModule,
    BoardsModule,
    PostsModule,
    AdminModule,
    AttendanceModule,
    ApprovalTemplatesModule,
  ],
})
export class AppModule { }

