import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ExceptionRpcFilter } from './@core/filters/exception-rpc.filter';
import { useContainer } from 'class-validator';
import { ValidationRpcPipe } from './@core/pipes/validation-rpc.pipe';
import { ConfigService } from '@nestjs/config';

(async () => {
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId:
            configService.get<string>('KAFKA_CLIENT_ID') || 'account-service',
          brokers: [
            configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
          ],
        },
        consumer: {
          groupId:
            configService.get<string>('KAFKA_CONSUMER_GROUP_ID') ||
            'account-service-consumer',
        },
      },
    },
  );

  //is used for transform pipes message
  app.useGlobalPipes(
    new ValidationRpcPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // is use for transform exception to rpc exception
  app.useGlobalFilters(new ExceptionRpcFilter());

  //is used for exclude attribute in entity
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  //is used for allow custom pipes attribute
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen();
})();
