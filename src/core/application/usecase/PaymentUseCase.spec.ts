import { anything, instance, mock, when } from "ts-mockito"
import { v4 } from "uuid"
import { IPaymentGateway } from "../external/IPaymentGateway"
import { IOrder, IOrderGateway } from "../repositories/IOrderGateway"
import { PaymentUseCase } from "./PaymentUseCase"

describe('PaymentUseCase', () => {
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
    })
})

const makePaymentGateway = () => {
    const m = mock<IPaymentGateway>()
    when(m.createPayment(anything())).thenResolve()
    return instance(m)
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