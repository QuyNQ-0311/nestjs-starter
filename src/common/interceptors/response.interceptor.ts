import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponseDto<T>> {
    const response = context.switchToHttp().getResponse<{ statusCode?: number }>();
    const statusCode: number = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data: unknown) => {
        // If response already has message and statusCode, return as is
        if (data && typeof data === 'object' && 'message' in data && 'statusCode' in data) {
          return data as BaseResponseDto<T>;
        }

        // If data is null or undefined, still wrap it
        return {
          message: 'Success',
          statusCode,
          result: data as T,
        };
      }),
    );
  }
}
