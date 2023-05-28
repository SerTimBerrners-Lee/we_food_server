import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true
    },
  });

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(5000);

  console.log('\n\n\n');
  console.log(`Server listening on port: 5000`);
  console.log('\n\n\n');
}
bootstrap();
