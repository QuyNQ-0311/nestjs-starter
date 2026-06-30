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
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionQueryDto } from './dto/permission-query.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@Controller('permission')
@AuthClaims()
@ApiBearerAuth('JWT-auth')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @Permissions([Permission.CREATE_PERMISSION])
  @AuthClaims()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get permissions list' })
  @Permissions([Permission.GET_PERMISSIONS])
  @AuthClaims()
  async findAll(@Query() query: PermissionQueryDto) {
    return this.permissionService.findAll(query.page, query.pageSize, query.isActive, query.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.GET_PERMISSION])
  @AuthClaims()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.UPDATE_PERMISSION])
  @AuthClaims()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission (soft delete)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.DELETE_PERMISSION])
  @AuthClaims()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
