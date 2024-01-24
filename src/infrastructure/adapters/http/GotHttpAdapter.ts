import { HttpStatus, Injectable } from '@nestjs/common';
import { OptionsOfJSONResponseBody, RequestError, Response } from 'got';
import { IncomingHttpHeaders } from 'http';
import { IGotClient } from './IGotClient';

export interface IHttpHeaders {
  [key: string]: string
}

export interface IHttpClientOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  url: string
  headers?: IHttpHeaders
  body?: unknown
}

export interface IHttpResponse<T> {
  statusCode: number
  error?: string
  body?: T
  headers: IHttpHeaders
}

@Injectable()
export class GotHttpAdapter  {
  constructor(private readonly got: IGotClient) {}
  
  public async request<TResponse extends IHttpResponse<unknown>>(options: IHttpClientOptions): Promise<TResponse> {
    try {
      const response = await this.got.request(this.mapOptions(options))
      return this.mapResponse<TResponse>(response)
    } catch (error) {
      console.log(error);
      if (error instanceof RequestError) {
        const {  response, stack } = error
        const { body, statusCode, headers} = response ?? {}
        return {
          statusCode, 
          error: stack, 
          body: body ?? {},
          headers: this.mapHeaders(headers)
        } as TResponse
      }
      return {
        statusCode: HttpStatus.FAILED_DEPENDENCY,
        body: {},
        error: 'integration-error',
        headers: {}
      } as TResponse
    } 
    
  }

  private mapOptions(request: IHttpClientOptions): OptionsOfJSONResponseBody {
    const { method, url, headers, body: json } = request ?? {}
    return { method, url, headers, json }
  }

  private mapResponse<TResponse extends IHttpResponse<unknown>>(response: Response): TResponse {
    const { statusCode, body, headers } = response ?? {}
    return {
      statusCode,
      body,
      headers: this.mapHeaders(headers),
      error: null
    } as TResponse
  }

  private mapHeaders(headers: IncomingHttpHeaders): IHttpHeaders {
    if (!headers) return {}

    const thisHeaders: IHttpHeaders = {}
    for (const key in headers) {
      const value = headers[key]
      thisHeaders [key] = Array.isArray(value) ? value.join(', ') : value
    }

    return thisHeaders
  }
}