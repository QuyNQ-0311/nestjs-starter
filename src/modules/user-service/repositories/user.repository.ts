import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: number, platformId: number) {
    return this.prisma.authServiceUser.findFirst({
      where: {
        id,
        platformId,
        deletedAt: null,
      },
      include: {
        platform: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByEmail(email: string, platformId: number) {
    return this.prisma.authServiceUser.findFirst({
      where: {
        email,
        platformId,
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
      orderBy?: Prisma.AuthServiceUserOrderByWithRelationInput;
    },
  ) {
    const { skip, take, search, orderBy } = options || {};

    const where: Prisma.AuthServiceUserWhereInput = {
      platformId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    return this.prisma.authServiceUser.findMany({
      where,
      include: {
        platform: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      skip,
      take,
      orderBy: orderBy || { createdAt: 'desc' },
    });
  }

  async count(platformId: number, search?: string) {
    const where: Prisma.AuthServiceUserWhereInput = {
      platformId,
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    return this.prisma.authServiceUser.count({
      where,
    });
  }

  async update(id: number, data: Prisma.AuthServiceUserUpdateInput) {
    return this.prisma.authServiceUser.update({
      where: { id },
      data,
      include: {
        platform: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.AuthServiceUserUncheckedCreateInput) {
    return this.prisma.authServiceUser.create({
      data,
      include: {
        platform: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}
