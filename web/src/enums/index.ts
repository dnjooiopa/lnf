export enum BalanceUnit {
  BTC = 'BTC',
  SATS = 'SATS', // default
  USD = 'USD',
  THB = 'THB',
}

export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

export enum TransactionType {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_SENT = 'payment_sent',
}
