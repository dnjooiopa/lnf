import { ErrorCode, EventType } from '@/enums'

export interface IBaseResponse {
  ok: boolean
  result: any
  error?: IBaseResponseError
}

export interface IBaseResponseError {
  code: ErrorCode
  message: string
}

export interface EventMessage {
  type: EventType
  data: any
}
