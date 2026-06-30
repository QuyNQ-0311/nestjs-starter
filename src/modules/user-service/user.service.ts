import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: number, platformId: number) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    return this.toProfileResponse(user);
  }

  async updateMyProfile(userId: number, platformId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    // Check if email already exists for another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email, platformId);

      if (existingUser && existingUser.id !== userId) {
        throw new BaseException(Errors.USER.EMAIL_EXISTS);
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateUserDto);

    // Remove sensitive data
    const { ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async getUserById(userId: number, platformId: number) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    return this.toProfileResponse(user);
  }

  async getUsers(platformId: number, page = 1, pageSize = 10, search?: string) {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      this.userRepository.findMany(platformId, {
        skip,
        take: pageSize,
        search,
      }),
      this.userRepository.count(platformId, search),
    ]);

    // Remove sensitive data
    const usersWithoutPassword = users.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ passwordHash, deletedAt, userRoles, ...user }) => user,
    );

    return {
      data: usersWithoutPassword,
      metadata: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createUser(platformId: number, createUserDto: CreateUserDto) {
    const { email, phone, avatar, password } = createUserDto;

    const existingUser = await this.userRepository.findByEmail(email, platformId);

    if (existingUser) {
      throw new BaseException(Errors.USER.EMAIL_EXISTS);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return this.userRepository.create({ platformId, email, phone, avatar, passwordHash });
  }

  async updateUser(userId: number, platformId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    // Check if email already exists for another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email, platformId);

      if (existingUser && existingUser.id !== userId) {
        throw new BaseException(Errors.USER.EMAIL_EXISTS);
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateUserDto);

    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async deleteUser(id: number, platformId: number) {
    const user = await this.userRepository.findById(id, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    return this.userRepository.update(id, {
      deletedAt: new Date(),
    });
  }

  private toProfileResponse(user: NonNullable<Awaited<ReturnType<UserRepository['findById']>>>) {
    const roles = user.userRoles.map((userRole) => ({
      id: userRole.role.id,
      code: userRole.role.code,
      name: userRole.role.name,
      isActive: userRole.role.isActive,
    }));

    const permissionsMap = new Map<string, { id: number; code: string; name: string | null }>();
    for (const userRole of user.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        if (rolePermission.permission.isActive) {
          permissionsMap.set(rolePermission.permission.code, {
            id: rolePermission.permission.id,
            code: rolePermission.permission.code,
            name: rolePermission.permission.name,
          });
        }
      }
    }

    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, deletedAt, userRoles, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, roles, permissions: Array.from(permissionsMap.values()) };
  }
}
