import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['permissionIds'] as const),
) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    example: [1, 2, 3],
    description:
      'Array of permission IDs to assign. Pass an empty array or null to remove all permissions.',
    type: [Number],
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[] | null;
}
