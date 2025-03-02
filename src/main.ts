import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(passport.initialize());

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`App running on port ${port}`);
}
bootstrap();
