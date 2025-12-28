import { Injectable } from '@nestjs/common';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { PermissionRepository } from '../permission-service/repositories/permission.repository';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
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

    return this.roleRepository.create({
      code: createRoleDto.code,
      name: createRoleDto.name,
      platform: {
        connect: { id: platformId },
      },
      isActive: true,
    });
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
      data: roles,
      meta: {
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

    return role;
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

    return this.roleRepository.update(id, platformId, {
      code: updateRoleDto.code,
      name: updateRoleDto.name,
      isActive: updateRoleDto.isActive,
    });
  }

  async remove(id: number, platformId: number) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    // Soft delete by setting isActive to false
    return this.roleRepository.update(id, platformId, {
      isActive: false,
    });
  }

  async assignPermissions(
    id: number,
    platformId: number,
    assignPermissionsDto: AssignPermissionsDto,
  ) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    // Validate all permissions exist
    if (assignPermissionsDto.permissionIds.length > 0) {
      const permissions = await Promise.all(
        assignPermissionsDto.permissionIds.map((permissionId) =>
          this.permissionRepository.findById(permissionId),
        ),
      );

      const invalidPermissions = permissions.filter((p) => !p || !p.isActive);
      if (invalidPermissions.length > 0) {
        throw new BaseException(Errors.ROLE.INVALID_PERMISSIONS);
      }
    }

    return this.roleRepository.assignPermissions(id, assignPermissionsDto.permissionIds);
  }

  async getRolePermissions(id: number, platformId: number) {
    const role = await this.roleRepository.findById(id, platformId);

    if (!role) {
      throw new BaseException(Errors.ROLE.NOT_FOUND);
    }

    return this.roleRepository.getRolePermissions(id);
  }
}
