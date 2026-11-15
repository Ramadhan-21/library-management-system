/*import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
   // Automatically transforms payloads to match DTO types
  }));
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();*/

/*import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Add this import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // This enables your DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out extra fields the user tries to send
    transform: true, // Automatically transforms payloads to match DTO types
  }));

  await app.listen(3000);
}
bootstrap();
*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Required by assignment:
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
  

