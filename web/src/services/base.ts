import { AxiosRequestConfig } from 'axios'

import Axios from '@/libs/axios'

export default class BaseService extends Axios {
  protected static async _post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return super.post(url, data, config)
  }
}
