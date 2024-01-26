import { HttpService } from "@nestjs/axios"
import { Test, TestingModule } from "@nestjs/testing"
import { Observable, of } from "rxjs"
import { IOrder, IOrderUpdate } from "src/core/application/repositories/IOrderGateway"
import { v4 } from 'uuid'
import OrderGateway from "./OrderGateway"

describe('OrderGateway', () => {
  let httpService: HttpService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HttpService,
          useValue: {
            request: jest.fn(() => of({})),
          },
        },
      ],
    }).compile();
    httpService = module.get<HttpService>(HttpService);
  })

  describe('OrderGateway.updateOrder', () => {
    it('should return order when update is successfull', async () => {
      // arrange
      const oauthToken = "my-token"
      const orderUpdate = makeOrderUpdate()
      const response = { data: ORDER } as any
      jest.spyOn(httpService, 'request').mockImplementationOnce(() => of(response))

      // act
      const actual = new OrderGateway(httpService).updateOrder(orderUpdate, oauthToken)

      // assert
      expect(actual).resolves.toBe(ORDER)
    })

    it('should throw error when update is error', async () => {
      // arrange
      const oauthToken = "my-token"
      const orderUpdate = makeOrderUpdate()
      const err = { response: 'resp', status: '500' }
      jest.spyOn(httpService, 'request').mockImplementationOnce(() => new Observable(p => p.error(err)))

      // act
      const actual = new OrderGateway(httpService).updateOrder(orderUpdate, oauthToken)

      // assert
      expect(actual).rejects.toThrowError()
    })
  })
})

const makeOrderUpdate = () => {
  return { id: ORDER.id, status: "PAID" } as IOrderUpdate
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