import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'user.create', description: 'Unique permission code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Create User', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Create a new user', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
