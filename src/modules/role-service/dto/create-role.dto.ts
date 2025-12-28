import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Unique role code within platform' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Administrator' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
