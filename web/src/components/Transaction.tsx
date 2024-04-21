'use client'

import { FC, useEffect, useState } from 'react'

import useIsMounted from '@/hooks/useIsMounted'

interface Payment {
  amount: number
  fees: number
  createdAt: number
  completedAt: number
  description: string
  isPaid: boolean
}

const formatDateTime = (ts: number) => {
  const date = new Date(ts)
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const Transaction: FC<{}> = () => {
  const isMounted = useIsMounted()
  const [payments, setPayments] = useState<Payment[]>([])

  const listIncomingPayments = async () => {
    try {
      const res = await fetch('/api/lnf.listincomingpayments', {
        method: 'POST',
      })
      const data = await res.json()

      // TODO: handle error

      // @ts-ignore
      let ps: Payment[] = data.result.reverse().map(({ receivedSat, ...tx }) => ({
        amount: receivedSat,
        ...tx,
      }))

      ps = ps.filter(({ isPaid }) => isPaid)

      setPayments(ps)
    } catch (e) {
      console.error('error:', e)
    }
  }

  useEffect(() => {
    if (!isMounted) return

    listIncomingPayments()

    return () => {}
  }, [isMounted])

  return (
    <div className="px-12 py-4">
      {payments.map(({ amount, description, createdAt }, i) => (
        <div key={i} className="flex justify-between mt-3">
          <div className="flex flex-col items-start">
            <div>
              <span className="text-lg">{description || 'received'}</span>
            </div>
            <div>
              <span className="text-sm">{formatDateTime(createdAt)}</span>
            </div>
          </div>
          <div>
            <span className="text-lg">{amount} sats</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Transaction
