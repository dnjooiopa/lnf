'use client'

import { FC, useEffect, useState } from 'react'

import useIsMounted from '@/hooks/useIsMounted'
import { LnFService } from '@/services/lnf'
import { useAppContext } from '@/contexts/AppContext'

interface IBalanceProps {}

const Balance: FC<IBalanceProps> = ({}) => {
  const isMounted = useIsMounted()
  const { displayAmount, changeAmountUnit, amountUnit } = useAppContext()
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
        changeAmountUnit()
      }}
    >
      <h1 className="text-6xl">{isLoading || !displayAmount ? '...' : displayAmount(balanceSat, amountUnit)}</h1>
      <p className="mt-2 text-lg">{amountUnit}</p>
    </div>
  )
}

export default Balance
