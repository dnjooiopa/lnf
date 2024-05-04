'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import { RiSendPlaneFill } from 'react-icons/ri'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'

import useIsMounted from '@/hooks/useIsMounted'
import { Transaction } from '@/types/lnf'
import { TransactionType } from '@/enums'
import { shortenTime } from '@/utils/date'
import { LnFService } from '@/services/lnf'
import { useAppContext } from '@/contexts/AppContext'
import { getUnitSymbol } from '@/utils/unit'
import Button from './base/Button'

const TxItem = ({ amountSat, description, createdAt, type }: Transaction) => {
  const { displayAmount, amountUnit } = useAppContext()

  const amountColor = type === TransactionType.PAYMENT_SENT ? 'text-gray-100' : 'text-green-500'
  // const displayDescription = description || (type === TransactionType.PAYMENT_SENT ? 'Sent' : 'Received')

  const displayAmt = useMemo(() => {
    if (!displayAmount) return '...'
    const amt = displayAmount(amountSat, amountUnit)
    return type === TransactionType.PAYMENT_SENT ? `-${amt}` : `+${amt}`
  }, [displayAmount, amountSat, amountUnit])

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
        <span className={`text-lg ${amountColor}`}>
          {displayAmt} {getUnitSymbol(amountUnit)}
        </span>
      </div>
    </div>
  )
}

const TxLimit = 5

const Transactions: FC<{}> = () => {
  const isMounted = useIsMounted()
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [limit, setLimit] = useState(TxLimit)
  const [total, setTotal] = useState(0)

  const hasNext = useMemo(() => transactions.length < total, [transactions, total])
  const hasPrev = useMemo(() => limit > TxLimit, [limit])

  const fetchTransactions = async (txLimit: number) => {
    setIsLoading(true)

    try {
      const { txs, total } = await LnFService.listTransactions({ limit: txLimit })

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

      <div className="flex gap-2 justify-center">
        {hasPrev && (
          <Button
            className="mt-4 w-[84px] flex justify-center"
            onClick={() => {
              fetchTransactions(limit - 5)
            }}
          >
            {isLoading ? '...' : <MdOutlineKeyboardArrowDown className="text-3xl transform rotate-180" />}
          </Button>
        )}

        {hasNext && (
          <Button
            className="mt-4 w-[84px] flex justify-center"
            onClick={() => {
              fetchTransactions(limit + 5)
            }}
          >
            {isLoading ? '...' : <MdOutlineKeyboardArrowDown className="text-3xl" />}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Transactions
