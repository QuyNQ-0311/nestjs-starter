import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './common/health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth-service/auth.module';
import { UserModule } from './modules/user-service/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
