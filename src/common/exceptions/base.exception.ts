import { HttpException } from '@nestjs/common';

export interface ErrorDetail {
  code: string;
  message: string;
  statusCode: number;
}

export class BaseException extends HttpException {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(error: ErrorDetail, customMessage?: string) {
    const message = customMessage || error.message;
    super(message, error.statusCode);
    this.code = error.code;
    this.statusCode = error.statusCode;
  }

  getResponse() {
    return {
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
    };
  }
}
