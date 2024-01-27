import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { IOrder, IOrderGateway, IOrderUpdate } from '../../../core/application/repositories/IOrderGateway';

@Injectable()
export default class OrderGateway implements IOrderGateway {
  constructor(private readonly httpService: HttpService) {}
  
  public async updateOrder(order: IOrderUpdate, oauthToken: string): Promise<IOrder> {
    const req = this.httpService.request<IOrder>({
      method: 'PUT',
      url: `${process.env.CLUSTER_URL}/orders/${order.id}`,
      data: { status: order.status},
      headers: { Authorization: oauthToken },
    })
    .pipe(map((res) => res.data))
    .pipe(catchError(() => {
      throw new BadRequestException('Unable to update Order')
    })) 
    
    return await lastValueFrom(req)
  }
}
