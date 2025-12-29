import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth-service/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';

export const AuthClaims = () => UseGuards(JwtAuthGuard, PermissionGuard);
