import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './repositories/permission.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService, PermissionRepository],
})
export class PermissionModule {}
