import { Injectable } from '@nestjs/common';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getProfile(userId: number, platformId: number) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateProfile(
    userId: number,
    platformId: number,
    updateData: { email?: string; phone?: string; avatar?: string },
  ) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    // Check if email already exists for another user
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(updateData.email, platformId);

      if (existingUser && existingUser.id !== userId) {
        throw new BaseException(Errors.USER.EMAIL_EXISTS);
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    // Remove sensitive data
    const { ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async getUserById(userId: number, platformId: number) {
    const user = await this.userRepository.findById(userId, platformId);

    if (!user) {
      throw new BaseException(Errors.USER.NOT_FOUND);
    }

    // Remove sensitive data
    const { ...userWithoutPassword } = user;

    return userWithoutPassword;
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
      ({ passwordHash, ...user }) => user,
    );

    return {
      data: usersWithoutPassword,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}
