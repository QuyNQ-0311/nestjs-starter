import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Errors } from '../../../common/constants/errors.constant';
import { BaseException } from '../../../common/exceptions/base.exception';
import { PrismaService } from '../../../database/prisma/prisma.service';

export interface JwtPayload {
  sub: number; // user id
  email: string;
  platformId: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.authServiceUser.findUnique({
      where: { id: payload.sub },
      include: { platform: true },
    });

    if (!user) {
      throw new BaseException(Errors.AUTH.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new BaseException(Errors.AUTH.USER_INACTIVE);
    }

    if (user.platformId !== payload.platformId) {
      throw new BaseException(Errors.AUTH.INVALID_PLATFORM);
    }

    return {
      id: user.id,
      email: user.email,
      platformId: user.platformId,
    };
  }
}
