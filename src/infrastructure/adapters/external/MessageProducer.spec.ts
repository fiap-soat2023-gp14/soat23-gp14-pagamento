import { SqsService } from '@ssut/nestjs-sqs';
import { MessageProducer } from './MessageProducer'; // Adjust the path if needed
import { config } from '../../config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@ssut/nestjs-sqs', () => ({
    SqsService: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({}), // Adjust behavior as needed
    })),
  }));
  

 
describe('MessageProducer', () => {
    let messageProducer: MessageProducer;
    let sqsService: SqsService;

    console.error = jest.fn();
   
    beforeEach(async() => {
        (console.error as jest.Mock).mockClear();
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageProducer, SqsService],
          }).compile();

          messageProducer = module.get<MessageProducer>(MessageProducer);
          sqsService = module.get<SqsService>(SqsService);
    });

    it('should send a message successfully', async () => {
        // Set up test data
        const body = { id: 123, status: 'APPROVED' };
        const expectedMessage = { id: 123, body: JSON.stringify(body) };

        // Mock the SqsService.send method
        (sqsService.send as jest.Mock).mockResolvedValueOnce({});

        // Call the sendMessage method
        await messageProducer.sendMessage(body);

        // Assert expected behavior
        expect(sqsService.send).toHaveBeenCalledTimes(1);
        expect(sqsService.send).toHaveBeenCalledWith(config.AWS_PEDIDOS_RESPONSE_QUEUE, expectedMessage);
    });

    it('should handle errors gracefully', async () => {
        // Set up test data
        const body = { id: 456, status: 'FAILED' };
        const expectedError = new Error('Something went wrong!');

        // Mock the SqsService.send method to throw an error
        (sqsService.send as jest.Mock).mockRejectedValueOnce(expectedError);

        // Call the sendMessage method (expecting a console error)
        await messageProducer.sendMessage(body);

        // Assert console error message
        expect(console.error).toHaveBeenCalledTimes(1);
        // expect(console.error).toHaveBeenCalledWith('error in producing image!', expectedError);
    });
});
