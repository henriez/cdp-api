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
    .setTitle("CDP-UTFPR's API")
    .setDescription(
      `Este documento descreve e exemplifica o uso desta API de gerenciamento de problemas e usuários, 
    fornecendo endpoints para criar, listar, atualizar e excluir dados relacionados. 

  **Recursos principais**:
  - **Problemas**: Gerencie problemas com informações como título, descrição, fonte, URL e status de uso.
  - **Contests**: Gerencie as listas de exercícios semanais
  - **Usuários**: Gerencie dados de usuários, incluindo cadastro, autenticação e permissões.
  `,
    )
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
