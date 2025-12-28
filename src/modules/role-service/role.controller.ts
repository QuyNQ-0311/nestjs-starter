import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth-service/guards/jwt-auth.guard';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new role' })
  async create(
    @CurrentUser('platformId') platformId: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.roleService.create(platformId, createRoleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get roles list' })
  async findAll(
    @CurrentUser('platformId') platformId: number,
    @Query() query: RoleQueryDto,
  ) {
    return this.roleService.findAll(
      platformId,
      query.page || 1,
      query.pageSize || 10,
      query.isActive,
      query.search,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
  ) {
    return this.roleService.findOne(id, platformId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, platformId, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
  ) {
    return this.roleService.remove(id, platformId);
  }

  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ) {
    return this.roleService.assignPermissions(id, platformId, assignPermissionsDto);
  }

  @Get(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get role permissions' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async getRolePermissions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
  ) {
    return this.roleService.getRolePermissions(id, platformId);
  }
}
