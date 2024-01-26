import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { PaymentController } from '../controller/PaymentController';
import PaymentApi from './PaymentApi';

describe('PaymentApi', () => {
  let paymentApi: PaymentApi;
  let paymentControllerMock: PaymentController;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    paymentControllerMock = {
      receivePaymentFeedback: PaymentController,
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentApi],
      providers: [
        { provide: PaymentController, useValue: paymentControllerMock }
      ],
    }).compile();

    mockRequest = {
      headers: jest.fn().mockReturnThis()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    paymentApi = module.get<PaymentApi>(PaymentApi);
  });

  it('should be defined', () => {
    expect(paymentApi).toBeDefined();
  });

  describe('createUser', () => {
    it('should call paymentController.receivePaymentFeedback', async () => {
      // arrange
      const paymentFeedbackDTO = makePaymentBody()
      paymentControllerMock.receivePaymentFeedback = jest.fn().mockResolvedValue({});

      // act
      await paymentApi.receivePaymentFeedback(mockRequest, paymentFeedbackDTO, mockResponse);

      // assert
      expect(paymentControllerMock.receivePaymentFeedback).toBeCalled();
      expect(mockResponse.status).toBeCalledWith(HttpStatus.NO_CONTENT);
    });
  });
});

const makePaymentBody = () => {
  return {
    id: 123456,
    type: 'payment',
    dateCreated: new Date(),
    status: 'PAID',
    data: { id: v4()}
  }
}