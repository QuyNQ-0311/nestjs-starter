import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository, UserWithRolesAndPermissions } from './repositories/auth.repository';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, platformId } = registerDto;

    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmailAndPlatformWithoutActiveCheck(
      email,
      platformId,
    );

    if (existingUser) {
      throw new BaseException(Errors.AUTH.EMAIL_EXISTS);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.authRepository.createUser({
      email,
      passwordHash,
      platformId,
      isActive: true,
    });

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      platformId: user.platformId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // Save refresh token to database
    await Promise.all([
      this.authRepository.createRefreshToken({
        platformId,
        userId: user.id,
        value: this.hashRefreshToken(refreshToken),
        isActive: true,
        expiresAt: this.getRefreshTokenExpiresAt(),
      }),
      this.authRepository.updateLastLoginAt(user.id),
    ]);

    return this.buildAuthResponse(user, accessToken, refreshToken);
  }

  async login(loginDto: LoginDto) {
    const { email, password, platformId } = loginDto;

    // Find user by email and platform
    const user = await this.authRepository.findUserByEmailAndPlatform(email, platformId);

    if (!user) {
      throw new BaseException(Errors.AUTH.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BaseException(Errors.AUTH.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      platformId: user.platformId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // Save refresh token to database
    await Promise.all([
      this.authRepository.createRefreshToken({
        platformId,
        userId: user.id,
        value: this.hashRefreshToken(refreshToken),
        isActive: true,
        expiresAt: this.getRefreshTokenExpiresAt(),
      }),
      this.authRepository.updateLastLoginAt(user.id),
    ]);

    return this.buildAuthResponse(user, accessToken, refreshToken);
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BaseException(Errors.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    const matchedToken = await this.authRepository.findRefreshTokenByValue(
      this.hashRefreshToken(refreshToken),
    );

    if (!matchedToken || !matchedToken.user.isActive) {
      throw new BaseException(Errors.AUTH.INVALID_REFRESH_TOKEN);
    }

    if (!matchedToken.isActive) {
      // Token was already rotated/revoked but is being used again: likely stolen.
      // Revoke every session for this user to force re-authentication everywhere.
      await this.authRepository.deactivateAllRefreshTokensByUserId(matchedToken.user.id);
      throw new BaseException(Errors.AUTH.REFRESH_TOKEN_REUSED);
    }

    if (matchedToken.expiresAt < new Date()) {
      await this.authRepository.updateRefreshToken(matchedToken.id, {
        isActive: false,
      });
      throw new BaseException(Errors.AUTH.REFRESH_TOKEN_EXPIRED);
    }

    // Generate new tokens
    const payload: JwtPayload = {
      sub: matchedToken.user.id,
      email: matchedToken.user.email,
      platformId: matchedToken.user.platformId,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken();

    // Atomically deactivate the old refresh token and create the new one
    await this.authRepository.rotateRefreshToken(matchedToken.id, {
      platformId: matchedToken.user.platformId,
      userId: matchedToken.user.id,
      value: this.hashRefreshToken(newRefreshToken),
      isActive: true,
      expiresAt: this.getRefreshTokenExpiresAt(),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: number, refreshToken: string): Promise<void> {
    // Deactivate only the refresh token used to log out (other devices stay logged in)
    await this.authRepository.deactivateRefreshTokenByValue(
      userId,
      this.hashRefreshToken(refreshToken),
    );
  }

  async logoutAllDevices(userId: number): Promise<void> {
    await this.authRepository.deactivateAllRefreshTokensByUserId(userId);
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiresAt(): Date {
    const expiresInSeconds = this.configService.get<number>('jwt.refreshTokenExpiresIn', 0);
    return new Date(Date.now() + expiresInSeconds * 1000);
  }

  private extractRolesAndPermissions(user: UserWithRolesAndPermissions) {
    const roles = user.userRoles.map((userRole) => ({
      id: userRole.role.id,
      code: userRole.role.code,
      name: userRole.role.name,
      isActive: userRole.role.isActive,
    }));

    // Get all unique permissions from all roles
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

    return { roles, permissions: Array.from(permissionsMap.values()) };
  }

  private buildAuthResponse(
    user: UserWithRolesAndPermissions,
    accessToken: string,
    refreshToken: string,
  ) {
    const expiresIn = this.configService.get<number>('jwt.expiresInSeconds', 3600);
    const { roles, permissions } = this.extractRolesAndPermissions(user);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        platformId: user.platformId,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles,
        permissions,
      },
    };
  }
}
