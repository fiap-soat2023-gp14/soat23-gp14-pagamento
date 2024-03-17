import { Inject } from '@nestjs/common';
import { PaymentFeedback } from '../../domain/entities/PaymentFeedback';
import { IPaymentGateway } from '../external/IPaymentGateway';
import { IOrder, IOrderGateway } from '../repositories/IOrderGateway';
import { MessageProducer } from 'src/infrastructure/adapters/external/MessageProducer';

export class PaymentUseCase {

  constructor( @Inject('MessageProducer') messageProducer: MessageProducer) { }
 
  public static async createPayment(
    order: IOrder,
    paymentGateway: IPaymentGateway,
  ) {
    await paymentGateway.createPayment(order);
  }

  public static async processPayment(
    oauthToken: string,
    paymentFeedback: PaymentFeedback,
    orderGateway: IOrderGateway,
  ) {
    if (paymentFeedback.type === 'payment') {
      switch (paymentFeedback.status) {
        case 'approved': {
          console.info('Payment approved.');
          await orderGateway.updateOrder({ id: paymentFeedback.orderId, status: 'PAID' }, oauthToken)
          break
        }
        
        case 'declined': {
          console.info('Payment declined.');
          await orderGateway.updateOrder({ id: paymentFeedback.orderId, status: 'CANCELLED' }, oauthToken)
          break
        }
      }
    }
  }

  public static async processConsumer(
    paymentFeedback: PaymentFeedback, messageProducer: MessageProducer
  ) {
    if (paymentFeedback.type === 'payment') {
      switch (paymentFeedback.status) {
        case 'approved': {
          console.info('Payment approved.');
          messageProducer.sendMessage({ id: paymentFeedback.orderId, status: 'PAID' });
          break
        }
        
        case 'declined': {
          console.info('Payment declined.');
          messageProducer.sendMessage({ id: paymentFeedback.orderId, status: 'CANCELLED' });
          break
        }
      }
    }
  }
}
