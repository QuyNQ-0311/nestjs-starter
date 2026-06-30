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
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@AuthClaims()
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @AuthClaims()
  async getProfile(@GetUser() user: { id: number; platformId: number }) {
    return this.userService.getProfile(user.id, user.platformId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @Permissions([Permission.UPDATE_USER])
  @AuthClaims()
  async updateMyProfile(
    @GetUser() user: { id: number; platformId: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMyProfile(user.id, user.platformId, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @Permissions([Permission.GET_USERS])
  @AuthClaims()
  async getUsers(@GetUser('platformId') platformId: number, @Query() query: PaginationQueryDto) {
    return this.userService.getUsers(platformId, query.page, query.pageSize, query.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.GET_USER])
  @AuthClaims()
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('platformId') platformId: number,
  ) {
    return this.userService.getUserById(id, platformId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.UPDATE_USER])
  @AuthClaims()
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('platformId') platformId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, platformId, updateUserDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @Permissions([Permission.CREATE_USER])
  @AuthClaims()
  async createUser(
    @GetUser('platformId') platformId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.createUser(platformId, createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (soft delete)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Permissions([Permission.DELETE_USER])
  @AuthClaims()
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('platformId') platformId: number,
  ) {
    return this.userService.deleteUser(id, platformId);
  }
}
