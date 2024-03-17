import { Inject, Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from '@aws-sdk/client-sqs';
import { config } from '../../config';
import { PaymentFeedbackDTO } from '../../../core/application/dto/PaymentFeedbackDTO';
import PaymentAdapter from 'src/core/application/adapter/PaymentAdapter';
import { PaymentUseCase } from 'src/core/application/usecase/PaymentUseCase';
import { MessageProducer } from './MessageProducer';



@Injectable()
export class MessageHandler {

    constructor( private  messageProducer: MessageProducer,) { }

    @SqsMessageHandler(config.AWS_PEDIDOS_QUEUE, false)
    async handleMessage(message: AWS.Message) {

        console.log('body', message.Body);
        const data: PaymentFeedbackDTO = JSON.parse(message.Body) as PaymentFeedbackDTO
  

        console.log('data', data);
        const paymentFeedback = await PaymentAdapter.toDomain(data);
        await PaymentUseCase.processConsumer(paymentFeedback, this.messageProducer);    
    }
}
