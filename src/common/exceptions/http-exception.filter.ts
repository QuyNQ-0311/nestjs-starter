import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Errors } from '../constants/errors.constant';
import { BaseException } from './base.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = Errors.DEFAULT.INTERNAL_ERROR.message;
    let code: string = Errors.DEFAULT.INTERNAL_ERROR.code;

    if (exception instanceof BaseException) {
      status = exception.statusCode;
      message = exception.message;
      code = exception.code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseMessage = (exceptionResponse as { message?: unknown }).message;
        if (Array.isArray(responseMessage) && typeof responseMessage[0] === 'string') {
          message = responseMessage[0];
        } else if (typeof responseMessage === 'string') {
          message = responseMessage;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
      code = `HTTP_${status}`;
    }

    const errorResponse = {
      message,
      statusCode: status,
      code,
    };

    response.status(status).json(errorResponse);
  }
}
