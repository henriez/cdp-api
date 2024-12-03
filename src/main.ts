import { config } from 'dotenv';
config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogInterceptor } from './common/interceptors/log.interceptor';
import { validationErrorFactory } from './common/errors/validationErrorFactory';
import { BusinessExceptionFilter } from './common/exceptions/business-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new BusinessExceptionFilter());
  app.useGlobalInterceptors(new LogInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: validationErrorFactory,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle("Henriez's Nestjs template")
    .setDescription('Template para APIs e microsserviços')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV !== 'dev') {
    app.enableShutdownHooks();
  }

  await app.listen(3000);
}

bootstrap();
