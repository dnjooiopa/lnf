'use client'

import { FC, useEffect, useState } from 'react'

import useIsMounted from '@/hooks/useIsMounted'
import { TransactionType } from '@/enums'

interface Transaction {
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

const formatDateTime = (ts: number) => {
  const date = new Date(ts)
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

const Tx = ({ amountSat, description, createdAt, type }: Transaction) => {
  const amountColor = type === TransactionType.PAYMENT_SENT ? 'text-gray-100' : 'text-green-500'
  const displayAmount = type === TransactionType.PAYMENT_SENT ? `-${amountSat}` : `+${amountSat}`
  const displayDescription = description || (type === TransactionType.PAYMENT_SENT ? 'Sent' : 'Received')

  return (
    <div className="flex justify-between mt-3">
      <div className="flex flex-col items-start">
        <div>
          <span className="text-lg">{displayDescription}</span>
        </div>
        <div>
          <span className="text-sm">{formatDateTime(createdAt)}</span>
        </div>
      </div>
      <div>
        <span className={`text-lg ${amountColor}`}>{displayAmount} sats</span>
      </div>
    </div>
  )
}

const Transactions: FC<{}> = () => {
  const isMounted = useIsMounted()
  const [payments, setPayments] = useState<Transaction[]>([])

  const listIncomingPayments = async () => {
    try {
      const res = await fetch('/api/lnf.listtransactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()

      // TODO: handle error

      let ps = data.result as Transaction[]

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
      {payments.map((tx, i) => (
        <Tx key={i} {...tx} />
      ))}
    </div>
  )
}

export default Transactions