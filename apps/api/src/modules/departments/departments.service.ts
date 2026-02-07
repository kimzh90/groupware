import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        children: true,
      },
    });
  }

  async getTree() {
    const allDepartments = await this.prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            position: true,
            role: true,
          },
        },
      },
    });

    const buildTree = (parentId: string | null = null): any[] => {
      return allDepartments
        .filter((dept) => dept.parentId === parentId)
        .map((dept) => ({
          ...dept,
          children: buildTree(dept.id),
        }));
    };

    return buildTree(null);
  }

  async create(data: any) {
    return this.prisma.department.create({ data });
  }
}
