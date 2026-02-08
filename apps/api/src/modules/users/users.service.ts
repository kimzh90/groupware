import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(options?: { search?: string; departmentId?: string; role?: string }) {
    const where: any = {};

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.departmentId) {
      where.departmentId = options.departmentId;
    }

    if (options?.role) {
      where.role = options.role;
    }

    return this.prisma.user.findMany({
      where,
      include: {
        department: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
        manager: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
