import { Module, Provider } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

const providers: Provider[] = [
  {
    provide: 'MAILER_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: configService.get<string>('MAILER_SERVICE_HOST'),
          port: configService.get<number>('MAILER_SERVICE_PORT'),
        },
      }),
  },
];

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  providers: [...providers],
  exports: [...providers],
})
export class InfrastructureModule {}
