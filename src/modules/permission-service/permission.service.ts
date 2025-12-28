import { Injectable } from '@nestjs/common';
import { BaseException } from '../../common/exceptions/base.exception';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionRepository } from './repositories/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // Check if permission code already exists
    const existingPermission = await this.permissionRepository.findByCode(createPermissionDto.code);

    if (existingPermission) {
      throw new BaseException({
        code: 'PERMISSION_001',
        message: 'Permission code already exists',
        statusCode: 409,
      });
    }

    return this.permissionRepository.create({
      code: createPermissionDto.code,
      name: createPermissionDto.name,
      description: createPermissionDto.description,
      isActive: true,
    });
  }

  async findAll(page = 1, pageSize = 10, isActive?: boolean, search?: string) {
    const skip = (page - 1) * pageSize;

    const where: { isActive?: boolean } = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [permissions, total] = await Promise.all([
      this.permissionRepository.findMany({
        skip,
        take: pageSize,
        where,
        search,
      }),
      this.permissionRepository.count(where, search),
    ]);

    return {
      data: permissions,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new BaseException({
        code: 'PERMISSION_002',
        message: 'Permission not found',
        statusCode: 404,
      });
    }

    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new BaseException({
        code: 'PERMISSION_002',
        message: 'Permission not found',
        statusCode: 404,
      });
    }

    return this.permissionRepository.update(id, {
      name: updatePermissionDto.name,
      code: updatePermissionDto.code,
      description: updatePermissionDto.description,
      isActive: updatePermissionDto.isActive,
    });
  }

  async remove(id: number) {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new BaseException({
        code: 'PERMISSION_002',
        message: 'Permission not found',
        statusCode: 404,
      });
    }

    // Soft delete by setting isActive to false
    return this.permissionRepository.update(id, {
      isActive: false,
    });
  }
}
