import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const PORT = 3001;
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
