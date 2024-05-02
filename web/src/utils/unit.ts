import { BalanceUnit } from '@/enums'

const unitSymbols: Record<BalanceUnit, string> = {
  [BalanceUnit.BTC]: '₿',
  [BalanceUnit.SATS]: 'sats',
  [BalanceUnit.THB]: '฿',
  [BalanceUnit.USD]: '$',
}

export const getUnitSymbol = (unit: BalanceUnit) => {
  return unitSymbols[unit]
}
