import { anything, instance, mock, when } from "ts-mockito"
import { v4 } from "uuid"
import { IPaymentGateway } from "../external/IPaymentGateway"
import { IOrder, IOrderGateway } from "../repositories/IOrderGateway"
import { PaymentUseCase } from "./PaymentUseCase"
import {PaymentFeedback} from "../../domain/entities/PaymentFeedback";
import {MessageProducer} from "../../../infrastructure/adapters/external/MessageProducer";
import {Test, TestingModule} from "@nestjs/testing";
import {SqsService} from "@ssut/nestjs-sqs";

jest.mock('@ssut/nestjs-sqs', () => ({
    SqsService: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue({}), // Adjust behavior as needed
    })),
}));

jest.mock('../../../infrastructure/adapters/external/MessageProducer');
describe('PaymentUseCase', () => {
    let messageProducer: MessageProducer;
    let sqsService: SqsService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageProducer, SqsService],
        }).compile();

        sqsService = module.get<SqsService>(SqsService);
        messageProducer = new MessageProducer(sqsService);
    });
    describe('PaymentUseCase.createPayment', () => {
        it('should create a payment on payment gateway', async () => {
            // arrange
            const order = makeOrder()
            const paymentGateway = makePaymentGateway()

            // act
            const actual = await PaymentUseCase.createPayment(order, paymentGateway)

            // assert
            expect(actual).toBe(undefined)
        })
    })

    describe('PaymentUseCase.createPayment', () => {
        it('should send update to order when approved', async () => {
            // arrange
            const oauthToken = "my-token"
            const paymentFeedback = { orderId: v4(), type: "payment", status: "approved" }
            const orderGateway = makeOrderGateway()

            // act
            const actual = await PaymentUseCase.processPayment(oauthToken, paymentFeedback, orderGateway)

            // assert
            expect(actual).toBe(undefined)
        })


        it('should send update to order when declined', async () => {
            // arrange
            const oauthToken = "my-token"
            const paymentFeedback = { orderId: v4(), type: "payment", status: "declined" }
            const orderGateway = makeOrderGateway()

            // act
            const actual = await PaymentUseCase.processPayment(oauthToken, paymentFeedback, orderGateway)

            // assert
            expect(actual).toBe(undefined)
        })

        describe('PaymentUseCase.createPaymentMessage', () => {
            it('should create a payment on message producer approved', async () => {
                // arrange
                const order = makeOrder();
                const paymentFeedback: PaymentFeedback = makePaymentFeedback();
                // act
                const actual = await PaymentUseCase.processConsumer(paymentFeedback, messageProducer)

                // assert
                expect(actual).toBe(undefined)
                expect(messageProducer.sendMessage).toHaveBeenCalledTimes(1);
            })

            it('should send update to order when declined', async () => {
                // arrange
                const oauthToken = "my-token"
                const paymentFeedback = { orderId: v4(), type: "payment", status: "declined" }


                // act
                const actual = await PaymentUseCase.processConsumer(paymentFeedback, messageProducer);

                // assert
                expect(actual).toBe(undefined)
                expect(messageProducer.sendMessage).toHaveBeenCalledTimes(1);
            })
        })
    })
})

const makePaymentGateway = () => {
    const m = mock<IPaymentGateway>()
    when(m.createPayment(anything())).thenResolve()
    return instance(m)
}

const makePaymentFeedback = () => {
    return {
        type: "payment",
        status: "approved",
        orderId: v4()
    } as PaymentFeedback
}

const makeOrderGateway = () => {
    const m = mock<IOrderGateway>()
    when(m.updateOrder(anything(), anything())).thenResolve()
    return instance(m)
}

const makeOrder = () => {
    return {
        id: v4(),
        status: "RECEIVED",
        items: [{
            product: {
                id: v4(),
                name: "CHEESEBURGUER",
                description: "Cheeseburguer",
                imageUrl: "http://imagetest.com.png",
                price: { value: 10.00, currency: "BRL" },
                createdAt: new Date(),
                category: 'SANDWICH'
            },
            observation: undefined,
            quantity: 1
        },],
        customer: {
            id: v4(),
            name: "João José",
            email: "joao-jose@email.com",
            cpf: { value: '12345678910' },
            phone: undefined,
            createdAt: new Date()
        },
        total: { value: 17.00, currency: 'BRL' },
        extraItems: undefined,
        createdAt: new Date(),
        deliveredAt: undefined
    } as IOrder
}