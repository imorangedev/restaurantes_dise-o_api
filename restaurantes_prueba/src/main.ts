import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  Logger.log('Initializing ValidationPipe...');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en los DTOs
    forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
    transform: true,
  }));
  Logger.log('ValidationPipe initialized.');


  await app.listen(3000);
  Logger.log('Server is running on http://localhost:3000');
}
bootstrap();
