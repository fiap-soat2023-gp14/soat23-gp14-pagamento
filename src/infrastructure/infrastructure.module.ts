import { Module } from '@nestjs/common';
import ApplicationModule from '../core/application/application.module';
import { IConnection } from './adapters/external/IConnection';
import { MongoConnection } from './adapters/external/MongoConnection';
import PaymentApi from './api/PaymentApi';

@Module({
  imports: [ApplicationModule],
  controllers: [PaymentApi],
  providers: [
    {
      provide: IConnection,
      useClass: MongoConnection,
    },
  ]
})
export default class InfrastructureModule {}
