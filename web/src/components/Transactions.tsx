'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'

import useIsMounted from '@/hooks/useIsMounted'
import Axios from '@/libs/axios'
import { Transaction } from '@/types'
import { TransactionType } from '@/enums'

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
  const [isLoading, setIsLoading] = useState(false)
  const [payments, setPayments] = useState<Transaction[]>([])
  const [limit, setLimit] = useState(5)
  const [total, setTotal] = useState(0)

  const hasNext = useMemo(() => payments.length < total, [payments, total])

  const fetchTransactions = async (txLimit: number) => {
    setIsLoading(true)

    try {
      const res = await Axios.post('/lnf.listtransactions', { limit: txLimit })

      let txs = (res.result.txs as Transaction[]).filter(({ isPaid }) => isPaid)

      setPayments([...txs])
      setTotal(res.result.total)
      setLimit(txLimit)
    } catch (e) {
      console.error('error:', e)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (!isMounted) return

    fetchTransactions(limit)

    return () => {}
  }, [isMounted])

  return (
    <div>
      {payments.map((tx, i) => (
        <Tx key={i} {...tx} />
      ))}

      {hasNext && (
        <button
          className="mt-4 p-2 bg-gray-700 rounded"
          onClick={() => {
            fetchTransactions(limit + 5)
          }}
        >
          {isLoading ? '...' : 'Load more'}
        </button>
      )}
    </div>
  )
}

export default Transactions
