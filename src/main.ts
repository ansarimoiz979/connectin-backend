import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validation pipe global
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors()
  // Global api endpoint prefix
  app.setGlobalPrefix('/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('LinkedIn api')
    .setDescription('The LinkedIn API description')
    .setVersion('1.0')
    .addTag('LinkedIn')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
