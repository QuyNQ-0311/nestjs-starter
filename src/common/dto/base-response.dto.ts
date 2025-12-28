import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  result?: T;
}
