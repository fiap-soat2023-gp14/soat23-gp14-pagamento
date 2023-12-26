import { Module } from '@nestjs/common';

import ApplicationModule from '../core/application/application.module';
import OrderApi from './api/OrderApi';
import PaymentApi from './api/PaymentApi';
import { MongoConnection } from './adapters/external/MongoConnection';
import { IConnection } from './adapters/external/IConnection';

@Module({
  imports: [ApplicationModule],
  controllers: [OrderApi, PaymentApi],
  providers: [
    {
      provide: IConnection,
      useClass: MongoConnection,
    },
  ]
})
export default class InfrastructureModule {}
