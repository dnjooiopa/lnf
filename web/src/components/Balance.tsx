'use client'

import { FC, useEffect, useMemo, useState } from 'react'

import { BalanceUnit } from '@/enums'
import useIsMounted from '@/hooks/useIsMounted'
import { LnFService } from '@/services/lnf'
import { useAppContext } from '@/contexts/AppContext'

interface IBalanceProps {}

const unitList = [BalanceUnit.SATS, BalanceUnit.THB, BalanceUnit.USD]

const HundredMillion = 100000000

const Balance: FC<IBalanceProps> = ({}) => {
  const isMounted = useIsMounted()
  const { priceTHB, priceUSD } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [balanceSat, setBalanceSat] = useState(0)
  const [balanceUnitIdx, setBalanceUnitIdx] = useState(0)

  const fetchBalance = async () => {
    try {
      const { balanceSat } = await LnFService.getBalance()

      setBalanceSat(balanceSat)
      setIsLoading(false)
    } catch (e) {
      console.error('error:', e)
    }
  }

  useEffect(() => {
    if (!isMounted) return

    fetchBalance()

    return () => {}
  }, [isMounted])

  const unit = useMemo(() => unitList[balanceUnitIdx], [balanceUnitIdx])

  const displayBalance = useMemo(() => {
    switch (unit) {
      case BalanceUnit.SATS:
        return balanceSat
      case BalanceUnit.THB:
        const blTHB = (balanceSat * priceTHB) / HundredMillion
        return balanceSat > 0 && blTHB <= 0 ? '...' : blTHB.toFixed(2)
      case BalanceUnit.USD:
        const blUSD = (balanceSat * priceUSD) / HundredMillion
        return balanceSat > 0 && blUSD <= 0 ? '...' : blUSD.toFixed(2)
      default:
        return balanceSat
    }
  }, [balanceSat, unit])

  return (
    <div
      onClick={() => {
        setBalanceUnitIdx((prev) => {
          return prev + 1 >= unitList.length ? 0 : prev + 1
        })
      }}
    >
      <h1 className="text-6xl">{isLoading ? '...' : displayBalance}</h1>
      <p className="mt-2 text-lg">{unit}</p>
    </div>
  )
}

export default Balance
