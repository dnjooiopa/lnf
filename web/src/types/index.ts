import { ErrorCode, TransactionType } from '@/enums'

export interface IBaseResponse {
  ok: boolean
  result: any
  error?: IBaseResponseError
}

export interface IBaseResponseError {
  code: ErrorCode
  message: string
}

export interface Transaction {
  paymentHash: string
  type: TransactionType
  paymentID: string
  amountSat: number
  fees: number
  externalID: string
  description: string
  invoice: string
  isPaid: boolean
  preimage: string
  completedAt: number
  createdAt: number
}
