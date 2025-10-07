import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8000;
  
  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });
  
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
