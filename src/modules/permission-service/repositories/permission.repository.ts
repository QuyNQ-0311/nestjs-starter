import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class PermissionRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: number) {
    return this.prisma.authServicePermission.findFirst({
      where: { id, deletedAt: null },
      include: {
        rolePermissions: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.authServicePermission.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async findMany(options?: {
    skip?: number;
    take?: number;
    search?: string;
    where?: Prisma.AuthServicePermissionWhereInput;
    orderBy?: Prisma.AuthServicePermissionOrderByWithRelationInput;
  }) {
    const { skip, take, search, where, orderBy } = options || {};

    const whereClause: Prisma.AuthServicePermissionWhereInput = {
      deletedAt: null,
      ...where,
    };

    if (search) {
      const searchConditions = [
        { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];

      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: searchConditions }];
        delete whereClause.OR;
      } else {
        whereClause.OR = searchConditions;
      }
    }

    return this.prisma.authServicePermission.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.AuthServicePermissionWhereInput, search?: string) {
    const whereClause: Prisma.AuthServicePermissionWhereInput = {
      deletedAt: null,
      ...where,
    };

    if (search) {
      const searchConditions = [
        { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];

      if (whereClause.OR) {
        whereClause.AND = [{ OR: whereClause.OR }, { OR: searchConditions }];
        delete whereClause.OR;
      } else {
        whereClause.OR = searchConditions;
      }
    }

    return this.prisma.authServicePermission.count({
      where: whereClause,
    });
  }

  async create(data: Prisma.AuthServicePermissionCreateInput) {
    return this.prisma.authServicePermission.create({
      data,
      include: {
        _count: {
          select: {
            rolePermissions: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.AuthServicePermissionUpdateInput) {
    return this.prisma.authServicePermission.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            rolePermissions: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.authServicePermission.delete({
      where: { id },
    });
  }
}
