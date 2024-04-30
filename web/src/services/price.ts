import { AxiosRequestConfig } from 'axios'

import BaseService from './base'

export class PriceService extends BaseService {
  static getPrice(config: AxiosRequestConfig = {}): Promise<GetPriceResult> {
    return this._post('/price.get', {}, config)
  }
}
