import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth-service/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: { id: number; platformId: number }) {
    return this.userService.getProfile(user.id, user.platformId);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user: { id: number; platformId: number },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(user.id, user.platformId, updateUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get users list' })
  async getUsers(
    @CurrentUser('platformId') platformId: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.userService.getUsers(
      platformId,
      query.page || 1,
      query.pageSize || 10,
      query.search,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('platformId') platformId: number,
  ) {
    return this.userService.getUserById(id, platformId);
  }
}
