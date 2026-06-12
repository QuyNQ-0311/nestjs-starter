import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('jwt.secret');
        if (!secret) {
          throw new Error('JWT_SECRET is not configured');
        }

        return {
          secret,
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
