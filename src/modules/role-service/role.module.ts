import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PermissionModule } from '../permission-service/permission.module';
import { RoleRepository } from './repositories/role.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [DatabaseModule, PermissionModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, RoleRepository],
})
export class RoleModule {}
