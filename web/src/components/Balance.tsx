'use client'

import { FC, useEffect, useState } from 'react'

import { BalanceUnit } from '@/enums'
import useIsMounted from '@/hooks/useIsMounted'

interface IBalanceProps {
  unit: BalanceUnit
}

const Balance: FC<IBalanceProps> = ({ unit }) => {
  const isMounted = useIsMounted()
  const [isLoading, setIsLoading] = useState(true)
  const [balanceSat, setBalanceSat] = useState(0)

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/lnf.getbalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await res.json()
      const { balanceSat } = data.result
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
    <div>
      <h1 className="text-6xl">{isLoading ? '...' : balanceSat}</h1>
      <p className="mt-2 text-lg">{unit}</p>
    </div>
  )
}

export default Balance
