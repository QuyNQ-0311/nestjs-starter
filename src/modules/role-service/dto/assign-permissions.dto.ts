import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of permission IDs',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds: number[];
}
