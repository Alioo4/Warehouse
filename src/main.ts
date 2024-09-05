import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  const config = app.get<ConfigService>(ConfigService);

  app.use(
    '/api/docs*',
    basicAuth({
    challenge: true,
    users: {admin: '1234'}
   }),
  );
  app.enableCors({
    origin: '*'
  });
  app.enableVersioning()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Warehouse API example')
    .setDescription('Warehouse API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(config.get<string>('PORT'), () => {
    console.log(`Server: http://localhost:${config.get<string>('PORT')}`);
    console.log(`Docs: http://localhost:${config.get<string>('PORT')}/api/docs`);
  });
}
bootstrap();
