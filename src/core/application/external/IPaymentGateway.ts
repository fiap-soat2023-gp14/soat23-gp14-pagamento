import { IOrder } from "../repositories/IOrderGateway";

export interface IPaymentGateway {
  createPayment(order: IOrder): Promise<void>;
}
