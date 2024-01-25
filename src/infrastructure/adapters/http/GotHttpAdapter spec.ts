import { RequestError } from "got"
import { anything, instance, mock, when } from "ts-mockito"
import { v4 } from 'uuid'
import { GotHttpAdapter } from "./GotHttpAdapter"
import { IGotClient } from "./IGotClient"

const HEADERS = { "x-client-header": "111222333444555" }
const RANDOM_OBJECT = { id: v4() }
const URL = "https://example.com.br"
type TResponse = { id: string }

describe('GotHttpAdapter', () => {
  it('should return the request when successfull', async () => {
    // arrange
    const { client } = makeMock({ statusCode: 200, headers: HEADERS, body: RANDOM_OBJECT })
    
    // act
    const actual = await client.request({
      method: 'GET',
      url: URL,
      headers: HEADERS,
    })

    // assert
    expect(actual).toStrictEqual({
      statusCode: 200,
      headers: HEADERS,
      body: RANDOM_OBJECT,
      error: null,
    })
  })

  it('should return error when requested failed', async () => {
        // arrange
        const requestError = new RequestError('request-timeout', new Error(), null)
        const { client } = makeMock({ statusCode: 500, headers: undefined, body: RANDOM_OBJECT }, requestError)
    
        // act
        const actual = await client.request({
          method: 'GET',
          url: URL,
          headers: HEADERS,
        })
    
        // assert
        expect(actual).toStrictEqual({
          statusCode: 500,
          headers: {},
          body: RANDOM_OBJECT,
          error: 'request-timeout',
        })
  })

  it('should return error when requested failed && error is generic', async () => {
    // arrange
    const { client } = makeMock(null, new Error())

    // act
    const actual = await client.request({
      method: 'GET',
      url: URL,
      headers: HEADERS,
    })

    // assert
    expect(actual).toStrictEqual({
      statusCode: 424,
      headers: {},
      body: {},
      error: 'integration-error',
    })
})
})

const makeMock = (response, error = null) => {
  const gotMock = mock<IGotClient>()
  const got = instance(gotMock)

  if (error) {
    if (response) {
      Object.defineProperty(error, 'response', { value: response } )
    }
    when(gotMock.request<TResponse>(anything())).thenReject(error)
  } else {
    when(gotMock.request<TResponse>(anything())).thenResolve(response)
  }
  const client = new GotHttpAdapter(got)
  return { client }
}