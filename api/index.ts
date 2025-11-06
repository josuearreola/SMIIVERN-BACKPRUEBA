import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as bodyParser from 'body-parser';

const server = express();
let app;

async function createNestServer() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.use(bodyParser.urlencoded({ extended: true }));

    // Validación global
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      origin: ['https://smiivern-frontend.vercel.app', 'http://localhost:4200'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('Backend SMIIVERN')
      .setDescription('APIs para la gestión de usuarios con login y registro')
      .setVersion('1.0')
      .addTag('auth')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    console.log('Nest Ready');
  }
  return app;
}

// Inicializar NestJS cuando se carga el módulo
createNestServer().catch((err) => console.error('Error starting Nest:', err));

export default server;
