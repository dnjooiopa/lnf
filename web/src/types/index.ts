import { ErrorCode } from '@/enums'

export interface IBaseResponse {
  ok: boolean
  result: any
  error?: IBaseResponseError
}

export interface IBaseResponseError {
  code: ErrorCode
  message: string
}
