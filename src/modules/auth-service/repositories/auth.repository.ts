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

export type UserWithRolesAndPermissions = Prisma.AuthServiceUserGetPayload<{
  include: {
    platform: true;
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findUserByEmailAndPlatform(
    email: string,
    platformId: number,
  ): Promise<UserWithRolesAndPermissions | null> {
    return this.prisma.authServiceUser.findFirst({
      where: {
        email,
        platformId,
        isActive: true,
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

  async findRefreshTokenByValue(value: string): Promise<RefreshTokenWithUser | null> {
    return this.prisma.authServiceRefreshToken.findUnique({
      where: { value },
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

  async rotateRefreshToken(
    oldTokenId: number,
    newToken: Prisma.AuthServiceRefreshTokenUncheckedCreateInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.authServiceRefreshToken.update({
        where: { id: oldTokenId },
        data: { isActive: false },
      });

      return tx.authServiceRefreshToken.create({ data: newToken });
    });
  }

  async deactivateRefreshTokenByValue(userId: number, value: string) {
    return this.prisma.authServiceRefreshToken.updateMany({
      where: {
        userId,
        value,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  async deactivateAllRefreshTokensByUserId(userId: number) {
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

  async createUser(
    data: Prisma.AuthServiceUserUncheckedCreateInput,
  ): Promise<UserWithRolesAndPermissions> {
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
