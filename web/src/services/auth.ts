import { AxiosRequestConfig } from 'axios'

import BaseService from './base'
import { LoginParams } from '@/types/auth'

export class AuthService extends BaseService {
  static login(params: LoginParams, config: AxiosRequestConfig = {}): Promise<any> {
    return this._post('/auth/login', params, config)
  }

  static logout(config: AxiosRequestConfig = {}): Promise<any> {
    return this._post('/auth/logout', {}, config)
  }
}
