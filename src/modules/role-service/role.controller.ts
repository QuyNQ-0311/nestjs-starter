import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import { AuthClaims } from '../../common/decorators/auth-claims.decorator';
import { GetUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@Controller('role')
@AuthClaims()
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @Permissions([Permission.CREATE_ROLE])
  @AuthClaims()
  async create(@GetUser('platformId') platformId: number, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(platformId, createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get roles list' })
  @Permissions([Permission.GET_ROLES])
  @AuthClaims()
  async findAll(@GetUser('platformId') platformId: number, @Query() query: RoleQueryDto) {
    return this.roleService.findAll(
      platformId,
      query.page,
      query.pageSize,
      query.isActive,
      query.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.GET_ROLE])
  @AuthClaims()
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser('platformId') platformId: number) {
    return this.roleService.findOne(id, platformId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.UPDATE_ROLE])
  @AuthClaims()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('platformId') platformId: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, platformId, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.DELETE_ROLE])
  @AuthClaims()
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser('platformId') platformId: number) {
    return this.roleService.remove(id, platformId);
  }
}
