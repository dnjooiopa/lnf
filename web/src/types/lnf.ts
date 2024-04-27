import { TransactionType } from '@/enums'

export interface GetBalanceResult {
  balanceSat: number
  feeCreditSat: number
}

export interface GetNodeInfoResult {
  nodeID: string
  channels: {
    state: string
    channelID: string
    balanceSat: number
    inboundLiquiditySat: number
    capacitySat: number
    fundingTxID: string
  }[]
}

export interface CreateInvoiceParams {
  description: string
  amountSat: number
  externalID?: string
}

export interface CreateInvoiceResult {
  amountSat: number
  paymentHash: string
  serialized: string
}

export interface PayInvoiceParams {
  amountSat?: number
  invoice: string
}

export interface PayInvoiceResult {
  recipientAmountSat: number
  routingFeeSat: number
  paymentID: string
  paymentHash: string
  paymentPreimage: string
}

export interface ListIncomingPaymentsParams {
  externalID: string
}

export interface ListIncomingPaymentsResult {
  paymentHash: string
  preimage: string
  externalID: string
  description: string
  invoice: string
  isPaid: boolean
  receivedSat: number
  fees: number
  completedAt: number
  createdAt: number
}

export interface ListTransactionsParams {
  offset?: number
  limit?: number
  from?: number
  to?: number
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

export interface ListTransactionsResult {
  total: number
  txs: Transaction[]
}
