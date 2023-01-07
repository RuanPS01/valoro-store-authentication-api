import { LoggerImpl } from '@external/logger/logger.service';
import { LoggingInterceptor } from '@main/interceptors/logger.interceptor';
import {
  ResponseFormat,
  ResponseInterceptor,
} from '@main/interceptors/response.interceptor';
import { AllExceptionFilter } from '@main/middlewares/error.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionFilter(new LoggerImpl()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerImpl()));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('valoro');

  // Swagger
  if (env !== 'prod') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Valoro Store (valoro-store-authentication-api)')
      .setDescription('AUthentication for Valoro Store')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3001);
}
bootstrap();
