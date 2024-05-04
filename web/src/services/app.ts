import { AxiosRequestConfig } from 'axios'

import { AppInfo } from '@/types/app'
import BaseService from './base'

export class AppService extends BaseService {
  static getInfo(config: AxiosRequestConfig = {}): Promise<AppInfo> {
    return this._post('/app.getinfo', {}, config)
  }
}
