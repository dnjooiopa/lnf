import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

import { ErrorCode } from '@/enums'
import { IBaseResponse } from '@/types'

const ax: AxiosInstance = axios.create({
  baseURL: '/api',
})

ax.interceptors.request.use(
  async (reqConfig) => {
    const config = reqConfig
    const accessToken = Cookies.get('token')

    if (config.headers) {
      if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

ax.interceptors.response.use(
  (res) => {
    const { error } = res.data as IBaseResponse
    if (error?.code === ErrorCode.UNAUTHORIZED || error?.code === ErrorCode.INVALID_TOKEN) {
      Cookies.remove('token')
    }
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default class Axios {
  static async post(path: string, data: any): Promise<any> {
    try {
      const res = await ax.post(path, data, {})
      if (res.data.error) {
        return Promise.reject(res.data.error)
      }
      return Promise.resolve(res.data.result)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
