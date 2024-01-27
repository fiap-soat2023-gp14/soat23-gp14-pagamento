import { HttpService } from '@nestjs/axios';
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
  constructor(private readonly controller: PaymentController) {}

  @Post()
  public async receivePaymentFeedback(
    @Req() req,
    @Body() body: PaymentFeedbackDTO,
    @Res() response,
  ): Promise<void> {
    const oauthToken = req.headers['authorization']
    await this.controller.receivePaymentFeedback(oauthToken, body, new OrderGateway(new HttpService()));
    return response.status(HttpStatus.NO_CONTENT).json();
  }
}
