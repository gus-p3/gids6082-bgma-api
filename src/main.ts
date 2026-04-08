import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllException } from './common/filters/http-exception.filter';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('combined'));

  //Configuración de swagger
  const config = new DocumentBuilder()
    .setTitle('API de Tareas')
    .setDescription('API para la gestión de tareas')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Servidor local')
    .addServer('http://dominio.com', 'Servidor de producción')
    .build();


  app.enableCors({
    origin: (origin, callback) => callback(null, true),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  //Pipe para realizar la validación de forma global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
bootstrap();

//? POSTGRES
//! npm i pg
//! npm i @types/pg

//? MYSQL
//! npm i mysql2
//! npm i @types/mysql

//! npm i @nestjs/swagger
