import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { green, red, yellow } from 'colorette';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use = (request: Request, response: Response, next: NextFunction) => {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '-';
    const start = Date.now();

    this.logger.log(`--> [${method}] ${originalUrl}`);

    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - start;
      const contentLength = response.get('content-length') || '0';
      const errorMessage =
        statusCode >= 400 && typeof response.locals.errorMessage === 'string'
          ? ` - ${response.locals.errorMessage}`
          : '';
      const message = `<-- [${method}] ${originalUrl} ${statusCode} ${duration}ms - ${contentLength} - ${userAgent} ${ip}${errorMessage}`;

      if (statusCode >= 500) {
        this.logger.error(red(message));
      } else if (statusCode >= 400) {
        this.logger.warn(yellow(message));
      } else {
        this.logger.log(green(message));
      }
    });

    next();
  };
}
