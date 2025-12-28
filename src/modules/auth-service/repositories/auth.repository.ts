import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PrismaService } from '../../../database/prisma/prisma.service';

export type RefreshTokenWithUser = Prisma.AuthServiceRefreshTokenGetPayload<{
  include: {
    user: {
      include: {
        platform: true;
      };
    };
  };
}>;

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findUserByEmailAndPlatform(email: string, platformId: number) {
    return this.prisma.authServiceUser.findFirst({
      where: {
        email,
        platformId,
        isActive: true,
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

  async findRefreshTokenByValue(value: string) {
    return this.prisma.authServiceRefreshToken.findFirst({
      where: {
        value,
        isActive: true,
      },
    });
  }

  async findRefreshTokensByUserId(userId: number) {
    return this.prisma.authServiceRefreshToken.findMany({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async findRefreshTokenWithUser(tokenId: number) {
    return this.prisma.authServiceRefreshToken.findUnique({
      where: { id: tokenId },
      include: {
        user: {
          include: {
            platform: true,
          },
        },
      },
    });
  }

  async createRefreshToken(data: Prisma.AuthServiceRefreshTokenUncheckedCreateInput) {
    return this.prisma.authServiceRefreshToken.create({
      data,
    });
  }

  async updateRefreshToken(id: number, data: Prisma.AuthServiceRefreshTokenUpdateInput) {
    return this.prisma.authServiceRefreshToken.update({
      where: { id },
      data,
    });
  }

  async deactivateRefreshTokensByUserId(userId: number) {
    return this.prisma.authServiceRefreshToken.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  async findAllActiveRefreshTokens(): Promise<RefreshTokenWithUser[]> {
    return this.prisma.authServiceRefreshToken.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: {
          include: {
            platform: true,
          },
        },
      },
    });
  }

  async createUser(data: Prisma.AuthServiceUserUncheckedCreateInput) {
    return this.prisma.authServiceUser.create({
      data,
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

  async findUserByEmailAndPlatformWithoutActiveCheck(email: string, platformId: number) {
    return this.prisma.authServiceUser.findFirst({
      where: {
        email,
        platformId,
      },
    });
  }
}
