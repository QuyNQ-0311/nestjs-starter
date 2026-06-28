import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Errors } from '../constants/errors.constant';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { BaseException } from '../exceptions/base.exception';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permission required
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number; platformId: number } }>();
    const user = request.user;

    if (!user) {
      throw new BaseException(Errors.AUTH.USER_NOT_FOUND);
    }

    // Get user with roles and permissions
    const userWithPermissions = await this.prisma.authServiceUser.findUnique({
      where: { id: user.id },
      include: {
        userRoles: {
          where: {
            role: {
              isActive: true,
              deletedAt: null,
            },
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  where: {
                    permission: {
                      isActive: true,
                      deletedAt: null,
                    },
                  },
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

    if (!userWithPermissions || userWithPermissions.deletedAt) {
      throw new BaseException(Errors.AUTH.USER_NOT_FOUND);
    }

    if (!userWithPermissions.isActive) {
      throw new BaseException(Errors.AUTH.USER_INACTIVE);
    }

    // Extract all permission codes
    const userPermissions = new Set<string>();
    userWithPermissions.userRoles.forEach((userRole) => {
      userRole.role.rolePermissions.forEach((rolePermission) => {
        userPermissions.add(rolePermission.permission.code);
      });
    });

    // Check if user has at least one of the required permissions
    const hasPermission = requiredPermissions.some((permission) => userPermissions.has(permission));

    if (!hasPermission) {
      throw new BaseException(Errors.PERMISSION.INSUFFICIENT);
    }

    return true;
  }
}
