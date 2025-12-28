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
        isActive: true,
      },
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

  async findByEmail(email: string, platformId: number) {
    return this.prisma.authServiceUser.findFirst({
      where: {
        email,
        platformId,
        isActive: true,
      },
    });
  }

  async findMany(
    platformId: number,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.AuthServiceUserOrderByWithRelationInput;
    },
  ) {
    const { skip, take, orderBy } = options || {};

    return this.prisma.authServiceUser.findMany({
      where: {
        platformId,
        isActive: true,
      },
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

  async count(platformId: number) {
    return this.prisma.authServiceUser.count({
      where: {
        platformId,
        isActive: true,
      },
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

  async create(data: Prisma.AuthServiceUserCreateInput) {
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
