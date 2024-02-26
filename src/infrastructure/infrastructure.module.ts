import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import ApplicationModule from '../core/application/application.module';
import OrderGateway from './adapters/gateway/OrderGateway';
import PaymentApi from './api/PaymentApi';
import { PaymentController } from './controller/PaymentController';
import { QueuesModule } from './adapters/external/queues.module';
import { MessageHandler } from './adapters/external/MessageConsumer';

@Module({
  imports: [ApplicationModule, HttpModule, QueuesModule],
  providers: [ OrderGateway, PaymentController],
  controllers: [PaymentApi],  
})

export default class InfrastructureModule {}
