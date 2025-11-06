import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.urlencoded({ extended: true })); // Nuevo: Para aceptar formularios

  // Validación global
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['https://smiivern-frontend.vercel.app', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }); // Habilitar CORS
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend SMIIVERN')
    .setDescription('APIs para la gestión de usuarios con login y registro')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Servidor corriendo en http://localhost:3000');
  console.log('Documentación Swagger en http://localhost:3000/api');
}
bootstrap();
