import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Permission } from '../../common/constants/permissions';
import { AuthClaims } from '../../common/decorators/auth-claims.decorator';
import { GetUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
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
  async updateProfile(
    @GetUser() user: { id: number; platformId: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user.id, user.platformId, updateUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @Permissions([Permission.GET_USERS])
  @AuthClaims()
  async getUsers(@GetUser('platformId') platformId: number, @Query() query: PaginationQueryDto) {
    return this.userService.getUsers(
      platformId,
      query.page || 1,
      query.pageSize || 10,
      query.search,
    );
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
}
