import { IOrder } from 'src/core/application/repositories/IOrderGateway';
import { v4 } from 'uuid';
import MercadoPagoPaymentGateway from './MercadoPagoPaymentGateway';

describe('MercadoPagoPaymentGateway', () => {
  it('should create payment with customer email when customer is provided', async () => {
    // arrange
    const order = makeOrder({ withEmail: true })

    // act
    // act
    const actual = new MercadoPagoPaymentGateway().createPayment(order)

    // assert
    expect(actual).resolves.not.toThrow()
  });

  it('should create payment with default email when customer is not provided', async () => {
    // arrange
    const order = makeOrder({ withEmail: false })

    // act
    const actual = new MercadoPagoPaymentGateway().createPayment(order)

    // assert
    expect(actual).resolves.not.toThrow()
  });
});

const makeOrder = ({ withEmail = true}) => {
  return {
    id: v4(),
    total: { value: 100 },
    customer: withEmail ? {email: 'customer@email.com'} : undefined,
  } as IOrder
}