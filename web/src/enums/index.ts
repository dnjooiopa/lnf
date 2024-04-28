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
  INVALID_PIN = 'INVALID_PIN',
}

export enum TransactionType {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_SENT = 'payment_sent',
}

export enum EventType {
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_SENT = 'payment_sent',
}
