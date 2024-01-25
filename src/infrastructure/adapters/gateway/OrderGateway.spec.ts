import { IOrder, IOrderUpdate } from "src/core/application/repositories/IOrderGateway"
import { anything, instance, mock, when } from "ts-mockito"
import { v4 } from 'uuid'
import { GotHttpAdapter } from "../http/GotHttpAdapter"
import OrderGateway from "./OrderGateway"

describe('OrderGateway', () => {
  describe('OrderGateway.updateOrder', () => {
    it('should return order when update is successfull', async () => {
      // arrange
      const httpService = makeHttpServiceOk()
      const oauthToken = "my-token"
      const orderUpdate = makeOrderUpdate()

      // act
      const actual = new OrderGateway(httpService).updateOrder(orderUpdate, oauthToken)
      
      // assert
      expect(actual).resolves.toBe(ORDER)
  })

  it('should throw error when update is error', async () => {
    // arrange
    const httpService = makeHttpServiceError()
    const oauthToken = "my-token"
    const orderUpdate = makeOrderUpdate()

    // act
    const actual = new OrderGateway(httpService).updateOrder(orderUpdate, oauthToken)
    
    // assert
    expect(actual).rejects.toThrowError()
})
  })
})

const makeHttpServiceOk = () => {
  const m = mock<GotHttpAdapter>()
  when(m.request(anything())).thenResolve({ statusCode: 200, body: ORDER, headers: {} })
  return instance(m)
}

const makeHttpServiceError = () => {
  const m = mock<GotHttpAdapter>()
  when(m.request(anything())).thenReject(new Error("internal server error"))
  return instance(m)
}

const makeOrderUpdate = () => {
  return { id: ORDER.id, status: "PAID"} as IOrderUpdate
}

const ORDER = {
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