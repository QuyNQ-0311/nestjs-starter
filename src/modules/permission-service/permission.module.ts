import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './permission.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}

