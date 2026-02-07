import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js client
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api');

  // Global Interceptor for Response Format
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Exception Filter for Error Format
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
