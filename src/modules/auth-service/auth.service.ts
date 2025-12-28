import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Errors } from '../../common/constants/errors.constant';
import { BaseException } from '../../common/exceptions/base.exception';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository, RefreshTokenWithUser } from './repositories/auth.repository';
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

    // Hash refresh token before storing
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Save refresh token to database
    await this.authRepository.createRefreshToken({
      platformId,
      userId: user.id,
      value: refreshTokenHash,
      isActive: true,
    });

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);

    // Extract roles and permissions
    const userRoles = (user as any).userRoles || [];
    const roles = userRoles.map((userRole: any) => ({
      id: userRole.role.id,
      code: userRole.role.code,
      name: userRole.role.name,
      isActive: userRole.role.isActive,
    }));

    // Get all unique permissions from all roles
    const permissionsMap = new Map<string, { id: number; code: string; name: string | null }>();
    userRoles.forEach((userRole: any) => {
      const rolePermissions = userRole.role?.rolePermissions || [];
      rolePermissions.forEach((rolePermission: any) => {
        if (rolePermission.permission?.isActive) {
          permissionsMap.set(rolePermission.permission.code, {
            id: rolePermission.permission.id,
            code: rolePermission.permission.code,
            name: rolePermission.permission.name,
          });
        }
      });
    });
    const permissions = Array.from(permissionsMap.values());

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

    // Hash refresh token before storing
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Save refresh token to database
    await this.authRepository.createRefreshToken({
      platformId,
      userId: user.id,
      value: refreshTokenHash,
      isActive: true,
    });

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);

    // Extract roles and permissions
    const userRoles = (user as any).userRoles || [];
    const roles = userRoles.map((userRole: any) => ({
      id: userRole.role.id,
      code: userRole.role.code,
      name: userRole.role.name,
      isActive: userRole.role.isActive,
    }));

    // Get all unique permissions from all roles
    const permissionsMap = new Map<string, { id: number; code: string; name: string | null }>();
    userRoles.forEach((userRole: any) => {
      const rolePermissions = userRole.role?.rolePermissions || [];
      rolePermissions.forEach((rolePermission: any) => {
        if (rolePermission.permission?.isActive) {
          permissionsMap.set(rolePermission.permission.code, {
            id: rolePermission.permission.id,
            code: rolePermission.permission.code,
            name: rolePermission.permission.name,
          });
        }
      });
    });
    const permissions = Array.from(permissionsMap.values());

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

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BaseException(Errors.AUTH.REFRESH_TOKEN_REQUIRED);
    }

    // Find all active refresh tokens for this token hash
    // We need to check all tokens because we stored hashed values
    const allTokens = await this.authRepository.findAllActiveRefreshTokens();

    // Find matching token by comparing hashes
    let matchedToken: RefreshTokenWithUser | null = null;
    for (const token of allTokens) {
      const isValid = await bcrypt.compare(refreshToken, token.value);
      if (isValid) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken || !matchedToken.user.isActive) {
      throw new BaseException(Errors.AUTH.INVALID_REFRESH_TOKEN);
    }

    // Generate new tokens
    const payload: JwtPayload = {
      sub: matchedToken.user.id,
      email: matchedToken.user.email,
      platformId: matchedToken.user.platformId,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    // Deactivate old refresh token
    await this.authRepository.updateRefreshToken(matchedToken.id, {
      isActive: false,
    });

    // Create new refresh token
    await this.authRepository.createRefreshToken({
      platformId: matchedToken.user.platformId,
      userId: matchedToken.user.id,
      value: newRefreshTokenHash,
      isActive: true,
    });

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN', 3600);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  }

  async logout(userId: number): Promise<void> {
    // Deactivate all refresh tokens for the user
    await this.authRepository.deactivateRefreshTokensByUserId(userId);
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }
}
