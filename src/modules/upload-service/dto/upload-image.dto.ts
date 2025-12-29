import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    required: false,
    example: 'avatars',
    description: 'Optional folder name in Cloudinary',
  })
  @IsString()
  @IsOptional()
  folder?: string;
}
