'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import { RiSendPlaneFill } from 'react-icons/ri'

import useIsMounted from '@/hooks/useIsMounted'
import Axios from '@/libs/axios'
import { Transaction } from '@/types'
import { TransactionType } from '@/enums'
import { shortenTime } from '@/utils/date'

const TxItem = ({ amountSat, description, createdAt, type }: Transaction) => {
  const amountColor = type === TransactionType.PAYMENT_SENT ? 'text-gray-100' : 'text-green-500'
  const displayAmount = type === TransactionType.PAYMENT_SENT ? `-${amountSat}` : `+${amountSat}`
  // const displayDescription = description || (type === TransactionType.PAYMENT_SENT ? 'Sent' : 'Received')

  const txIcon = useMemo(
    () =>
      type === TransactionType.PAYMENT_SENT ? (
        <RiSendPlaneFill className={`text-2xl ${amountColor}`} />
      ) : (
        <RiSendPlaneFill className={`text-2xl ${amountColor} rotate-90`} />
      ),
    [type]
  )

  return (
    <div className="flex justify-between mt-3 py-1">
      <div className="flex gap-2 items-start">
        <div>{txIcon}</div>
        <div>
          <span className="text-md">{shortenTime(new Date(createdAt))}</span>
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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [limit, setLimit] = useState(5)
  const [total, setTotal] = useState(0)

  const hasNext = useMemo(() => transactions.length < total, [transactions, total])

  const fetchTransactions = async (txLimit: number) => {
    setIsLoading(true)

    try {
      const { txs, total } = await Axios.post('/lnf.listtransactions', { limit: txLimit })

      setTransactions([...txs])
      setTotal(total)
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
      {transactions.map((tx, i) => (
        <TxItem key={i} {...tx} />
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
