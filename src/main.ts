import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { blue } from 'colorette';
import { AppModule } from './app.module';
import { APP_CONFIG, SWAGGER_CONFIG } from './common/constants/app.constant';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = APP_CONFIG.GLOBAL_PREFIX;

  app.use(new LoggingMiddleware().use);
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('app.corsOrigin', '*'),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.TITLE)
    .setDescription(SWAGGER_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_CONFIG.VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      SWAGGER_CONFIG.BEARER_AUTH_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_CONFIG.SWAGGER_PATH, app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });

  const port = configService.get<number>('app.port', APP_CONFIG.DEFAULT_PORT);

  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${blue(`http://localhost:${port}/${globalPrefix}`)}`);
  Logger.log(
    `🚀 Application Swagger is running on: ${blue(`http://localhost:${port}/${APP_CONFIG.SWAGGER_PATH}`)}`,
  );
}

void bootstrap();
