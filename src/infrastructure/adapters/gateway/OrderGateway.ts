import { Injectable } from '@nestjs/common';
import { IOrder, IOrderGateway, IOrderUpdate } from '../../../core/application/repositories/IOrderGateway';
import { GotHttpAdapter, IHttpResponse } from '../http/GotHttpAdapter';

@Injectable()
export default class OrderGateway implements IOrderGateway {
  constructor(private readonly httpService: GotHttpAdapter) {}
  
  public async updateOrder(order: IOrderUpdate, oauthToken: string): Promise<IOrder> {
    try {
      const req = await this.httpService.request<IHttpResponse<IOrder>>({
        method: 'PUT',
        url: `${process.env.ORDER_HOST}/${order.id}`,
        body: order.status,
        headers: { 'Authorization': oauthToken }
      })
      console.log('Order updated successfully.');
      return req.body
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
}
