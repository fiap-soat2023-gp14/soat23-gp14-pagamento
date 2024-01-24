import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res
} from '@nestjs/common';
import { PaymentFeedbackDTO } from '../../core/application/dto/PaymentFeedbackDTO';
import OrderGateway from '../adapters/gateway/OrderGateway';
import { PaymentController } from '../controller/PaymentController';

@Controller('payments/')
export default class PaymentApi {
  constructor(
    private readonly orderGateway: OrderGateway,
  ) {}

  @Post()
  public async receivePaymentFeedback(
    @Req() req,
    @Body() body: PaymentFeedbackDTO,
    @Res() response,
  ) {
    
    await PaymentController.receivePaymentFeedback(req.headers['authorization'], body, this.orderGateway);
    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
