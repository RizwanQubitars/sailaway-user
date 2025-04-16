import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ErrorInterceptor } from './intercepters/error.interceptor';

async function bootstrap() {
  console.log('user server is listning')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    },
  );
  app.useGlobalInterceptors(new ErrorInterceptor());
  await app.listen();
}
bootstrap();
