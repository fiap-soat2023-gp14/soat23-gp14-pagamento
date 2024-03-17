import PaymentAdapter from 'src/core/application/adapter/PaymentAdapter';
import { PaymentUseCase } from 'src/core/application/usecase/PaymentUseCase';
import * as AWS from 'aws-sdk';
import { MessageHandler } from './MessageConsumer';
import { MessageProducer } from './MessageProducer';
import { Test, TestingModule } from '@nestjs/testing';

 // Assuming it's in the same directory
jest.mock('./MessageProducer'); // Mock MessageProducer to avoid external calls
jest.mock('src/core/application/adapter/PaymentAdapter'); // Mock PaymentAdapter to isolate its behavior
jest.mock('src/core/application/usecase/PaymentUseCase'); // Mock PaymentUseCase to focus on MessageHandler logic

describe('MessageHandler', () => {
    let messageHandler: MessageHandler;
    let messageProducer: MessageProducer;

    const sqs = new AWS.SQS();

    beforeEach(async () => {


        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageProducer],
          }).compile();

          messageProducer = module.get<MessageProducer>(MessageProducer);
          messageHandler = new MessageHandler(messageProducer);
    });

    it('should handle a message successfully', async () => {
        // Set up test data
        const messageBody = '{"paymentId": 123, "status": "APPROVED"}';

        // Mock external functions
        (PaymentAdapter.toDomain as jest.Mock).mockResolvedValueOnce({
            paymentId: 123,
            status: 'APPROVED'
        });
        (PaymentUseCase.processConsumer as jest.Mock).mockResolvedValueOnce({});

        // Create a mock AWS.Message object
        const message= { Body: messageBody };

        // Call the handleMessage method
        await messageHandler.handleMessage(message);

        // Assert expected behavior
        expect(PaymentAdapter.toDomain).toHaveBeenCalledTimes(1);
        expect(PaymentAdapter.toDomain).toHaveBeenCalledWith({ paymentId: 123, status: 'APPROVED' });
        expect(PaymentUseCase.processConsumer).toHaveBeenCalledTimes(1);
        expect(PaymentUseCase.processConsumer).toHaveBeenCalledWith({ paymentId: 123, status: 'APPROVED' }, messageProducer);
    });

    // Add more tests for different scenarios, error handling, etc.
});
