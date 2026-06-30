import { Injectable } from '@nestjs/common';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { PermissionRepository } from '../permission-service/repositories/permission.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository,
    private permissionRepository: PermissionRepository,
  ) {}

  async create(platformId: number, createRoleDto: CreateRoleDto) {
    // Check if role code already exists in this platform
    const existingRole = await this.roleRepository.findByCode(createRoleDto.code, platformId);

    if (existingRole) {
      throw new BaseException(Errors.ROLE.CODE_EXISTS);
    }

    if (createRoleDto.permissionIds) {
      await this.validatePermissionIds(createRoleDto.permissionIds);
    }

    const role = await this.roleRepository.create({
      code: createRoleDto.code,
      name: createRoleDto.name,
      platform: {
        connect: { id: platformId },
      },
      isActive: true,
      ...(createRoleDto.permissionIds && {
        rolePermissions: {
          create: createRoleDto.permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      }),
    });

    return this.toRoleResponse(role);
  }

  private toRoleResponse(role: NonNullable<Awaited<ReturnType<RoleRepository['findById']>>>) {
    const permissions = role.rolePermissions.map((rolePermission) => ({
      id: rolePermission.permission.id,
      code: rolePermission.permission.code,
      name: rolePermission.permission.name,
      description: rolePermission.permission.description,
      isActive: rolePermission.permission.isActive,
      createdAt: rolePermission.permission.createdAt,
      updatedAt: rolePermission.permission.updatedAt,
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rolePermissions, deletedAt, ...roleWithoutRolePermissions } = role;

    return { ...roleWithoutRolePermissions, permissions };
  }

  private async validatePermissionIds(permissionIds: number[]) {
    if (permissionIds.length === 0) {
      return;
    }

    const permissions = await Promise.all(
      permissionIds.map((permissionId) => this.permissionRepository.findById(permissionId)),
    );

    const hasInvalidPermission = permissions.some(
      (permission) => !permission || !permission.isActive,
    );
    if (hasInvalidPermission) {
      throw new BaseException(Errors.ROLE.INVALID_PERMISSIONS);
    }
  }

  async findAll(platformId: number, page = 1, pageSize = 10, isActive?: boolean, search?: string) {
    const skip = (page - 1) * pageSize;

    const where: { isActive?: boolean } = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [roles, total] = await Promise.all([
      this.roleRepository.findMany(platformId, {
        skip,
        take: pageSize,
        where,
        search,
      }),
      this.roleRepository.count(platformId, where, search),
    ]);

    return {
      data: roles.map((role) => this.toRoleResponse(role)),
      metadata: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number, platformId: number) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    return this.toRoleResponse(role);
  }

  async update(id: number, platformId: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    // Check if code is being updated and if it conflicts
    if (updateRoleDto.code && updateRoleDto.code !== role.code) {
      const existingRole = await this.roleRepository.findByCode(updateRoleDto.code, platformId);

      if (existingRole && existingRole.id !== id) {
        throw new BaseException(Errors.ROLE.CODE_EXISTS);
      }
    }

    // permissionIds === undefined means "not provided, keep existing permissions"
    // permissionIds === null or [] means "clear all permissions"
    const permissionIds = updateRoleDto.permissionIds;
    if (permissionIds !== undefined) {
      await this.validatePermissionIds(permissionIds ?? []);
    }

    const updatedRole = await this.roleRepository.update(id, platformId, {
      code: updateRoleDto.code,
      name: updateRoleDto.name,
      isActive: updateRoleDto.isActive,
      ...(permissionIds !== undefined && {
        rolePermissions: {
          deleteMany: {},
          create: (permissionIds ?? []).map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
      }),
    });

    return this.toRoleResponse(updatedRole);
  }

  async remove(id: number, platformId: number) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    return this.roleRepository.update(id, platformId, {
      deletedAt: new Date(),
    });
  }
}
