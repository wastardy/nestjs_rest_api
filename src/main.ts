import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3333);
// }

// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete all underfined fields in DTO from input data
    }),
  );

  const PORT = process.env.PORT ?? 3333;

  await app.listen(PORT);
  console.log(`🚀 Server is running on port ${PORT}`);
}

bootstrap().catch((err) => {
  console.log('❌ Error starting server:', err);
  process.exit(1);
});
