import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as bodyParser from 'body-parser';

const server = express();

async function createNestServer(expressInstance) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(bodyParser.urlencoded({ extended: true }));

  // Validación global
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['https://smiivern-frontend.vercel.app', 'http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
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
  return app;
}

// Agregar una ruta de prueba simple
server.get('/', (req, res) => {
    res.json({ message: 'SMIIVERN Backend API funcionando!', status: 'ok' });
});

createNestServer(server)
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));

export default server;