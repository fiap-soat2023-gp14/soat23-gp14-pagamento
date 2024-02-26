import { IOrder } from 'src/core/application/repositories/IOrderGateway';
import PaymentAdapter from '../../core/application/adapter/PaymentAdapter';
import { PaymentFeedbackDTO } from '../../core/application/dto/PaymentFeedbackDTO';
import { PaymentUseCase } from '../../core/application/usecase/PaymentUseCase';
import MercadoPagoPaymentGateway from '../adapters/external/MercadoPagoPaymentGateway';
import OrderGateway from '../adapters/gateway/OrderGateway';

export class PaymentController {
  public async createPayment(order: IOrder) {
    const paymentGateway = new MercadoPagoPaymentGateway();
    await PaymentUseCase.createPayment(order, paymentGateway);
  }

  public async receivePaymentFeedback(
    oauthToken: string,
    paymentFeedbackDTO: PaymentFeedbackDTO,
    orderGateway: OrderGateway
  ): Promise<void> {
    const paymentFeedback = await PaymentAdapter.toDomain(paymentFeedbackDTO);
    await PaymentUseCase.processPayment(oauthToken, paymentFeedback, orderGateway);
  }
}
