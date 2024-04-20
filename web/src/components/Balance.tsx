import { FC } from 'react'

import { BalanceUnit } from '@/enums'

interface IBalanceProps {
  balance: number
  unit: BalanceUnit
}

const Balance: FC<IBalanceProps> = ({ balance, unit }) => {
  return (
    <div>
      <h1 className="text-6xl">{balance}</h1>
      <p className="mt-2 text-lg">{unit}</p>
    </div>
  )
}

export default Balance
