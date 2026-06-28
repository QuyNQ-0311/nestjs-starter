import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import cloudinaryConfig from './config/cloudinary.config';
import databaseConfig from './config/database.config';
import { validate } from './config/env.validation';
import jwtConfig from './config/jwt.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth-service/auth.module';
import { HealthModule } from './modules/health-service/health.module';
import { PermissionModule } from './modules/permission-service/permission.module';
import { RoleModule } from './modules/role-service/role.module';
import { UploadModule } from './modules/upload-service/upload.module';
import { UserModule } from './modules/user-service/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, jwtConfig, cloudinaryConfig],
      validate,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    UploadModule,
  ],
})
export class AppModule {}
