import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    allowedHeaders: '*',
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:1996',
    ],
    credentials: true,
  });
  await app.listen(1996);
}
bootstrap();
