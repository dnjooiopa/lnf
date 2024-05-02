'use client'

import { FC, useEffect, useMemo, useState } from 'react'

import { BalanceUnit } from '@/enums'
import useIsMounted from '@/hooks/useIsMounted'
import { LnFService } from '@/services/lnf'
import { useAppContext } from '@/contexts/AppContext'

interface IBalanceProps {}

const Balance: FC<IBalanceProps> = ({}) => {
  const isMounted = useIsMounted()
  const { displayBalance, changeBalanceUnit, balanceUnit } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [balanceSat, setBalanceSat] = useState(0)

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

  return (
    <div
      onClick={() => {
        changeBalanceUnit()
      }}
    >
      <h1 className="text-6xl">{isLoading || !displayBalance ? '...' : displayBalance(balanceSat, balanceUnit)}</h1>
      <p className="mt-2 text-lg">{balanceUnit}</p>
    </div>
  )
}

export default Balance
