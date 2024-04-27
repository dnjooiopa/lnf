'use client'

import { FC, useEffect, useState } from 'react'
import { format } from 'date-fns'

import useIsMounted from '@/hooks/useIsMounted'
import { TransactionType } from '@/enums'
import Axios from '@/libs/axios'

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
  const f = 'yyyy-MM-dd HH:mm:ss'
  return format(new Date(ts), f)
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
  const [limit, setLimit] = useState(5)

  const listIncomingPayments = async () => {
    try {
      const res = await Axios.post('/lnf.listtransactions', { limit })
      let txs = (res.result.txs as Transaction[]).filter(({ isPaid }) => isPaid)
      setPayments(txs)
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
    <div>
      {payments.map((tx, i) => (
        <Tx key={i} {...tx} />
      ))}
    </div>
  )
}

export default Transactions
