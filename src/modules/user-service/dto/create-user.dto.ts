import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+84901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({ example: 'Password@123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
