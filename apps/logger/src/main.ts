import { NestFactory } from '@nestjs/core';
import { LoggerModule } from './logger.module';

async function bootstrap() {
  const app = await NestFactory.create(LoggerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
