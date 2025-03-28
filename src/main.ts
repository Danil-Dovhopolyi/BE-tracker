import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Finance Tracker API')
    .setDescription('The API for user authentication and management')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      showExtensions: true,
      showMutatedRequest: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 1,
      deepLinking: true,
      displayOperationId: true,
      layout: 'BaseLayout',
      supportedSubmitMethods: [
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace'
      ],
      tryItOutEnabled: true,
      validatorUrl: null,
      withCredentials: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Finance Tracker API Documentation",
    customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
