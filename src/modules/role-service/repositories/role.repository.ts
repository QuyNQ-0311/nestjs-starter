import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class RoleRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: number, platformId: number) {
    return this.prisma.authServiceRole.findFirst({
      where: {
        id,
        platformId,
        deletedAt: null,
      },
      include: {
        platform: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }

  async findByCode(code: string, platformId: number) {
    return this.prisma.authServiceRole.findFirst({
      where: {
        platformId,
        code,
        deletedAt: null,
      },
    });
  }

  async findMany(
    platformId: number,
    options?: {
      skip?: number;
      take?: number;
      search?: string;
      where?: Prisma.AuthServiceRoleWhereInput;
      orderBy?: Prisma.AuthServiceRoleOrderByWithRelationInput;
    },
  ) {
    const { skip, take, search, where, orderBy } = options || {};

    const whereClause: Prisma.AuthServiceRoleWhereInput = {
      platformId,
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

    return this.prisma.authServiceRole.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        platform: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }

  async count(platformId: number, where?: Prisma.AuthServiceRoleWhereInput, search?: string) {
    const whereClause: Prisma.AuthServiceRoleWhereInput = {
      platformId,
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

    return this.prisma.authServiceRole.count({
      where: whereClause,
    });
  }

  async create(data: Prisma.AuthServiceRoleCreateInput) {
    return this.prisma.authServiceRole.create({
      data,
      include: {
        platform: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }

  async update(id: number, platformId: number, data: Prisma.AuthServiceRoleUpdateInput) {
    return this.prisma.authServiceRole.update({
      where: {
        id,
        platformId,
      },
      data,
      include: {
        platform: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }

  async getRolePermissions(roleId: number) {
    const rolePermissions = await this.prisma.authServiceRolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp) => rp.permission);
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    // Delete existing permissions
    await this.prisma.authServiceRolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    // Create new permissions
    if (permissionIds.length > 0) {
      await this.prisma.authServiceRolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }

    // Return updated role with permissions
    return this.prisma.authServiceRole.findUnique({
      where: { id: roleId },
      include: {
        platform: true,
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });
  }
}
