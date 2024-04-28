'use client'

import { Transition } from '@headlessui/react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useQRCode } from 'next-qrcode'
import { FC, Fragment, useEffect, useState } from 'react'
import { FaCopy, FaRegCheckCircle } from 'react-icons/fa'
import { useCopyToClipboard } from 'usehooks-ts'

import { EventType } from '@/enums'
import useIsMounted from '@/hooks/useIsMounted'
import { LnFService } from '@/services/lnf'
import { EventMessage } from '@/types'
import { Transaction } from '@/types/lnf'

const Receive: FC<{}> = () => {
  const { Canvas: QRCanvas } = useQRCode()
  const isMounted = useIsMounted()

  const [amountSat, setAmountSat] = useState<number>(0)
  const [receivedAmountSat, setReceivedAmountSat] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [openInvoice, setOpenInvoice] = useState<boolean>(false)
  const [isPaymentReceived, setIsPaymentReceived] = useState<boolean>(false)

  const [_, copy] = useCopyToClipboard()

  const clearResult = () => {
    setInvoice('')
    setAmountSat(0)
    setDescription('')
    setIsPaymentReceived(false)
    setReceivedAmountSat(0)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!(amountSat > 0 && amountSat < 2000000)) {
      return alert('Invalid amount')
    }

    setIsLoading(true)

    try {
      const { serialized } = await LnFService.createInvoice({ amountSat, description })
      setInvoice(serialized)
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (!isMounted) return

    const source = new EventSourcePolyfill(`/api/event.subscribe`)

    source.onmessage = (e) => {
      const event = JSON.parse(e.data) as EventMessage
      if (event?.type !== EventType.PAYMENT_RECEIVED) return

      const data = event.data as Transaction
      setReceivedAmountSat(data.amountSat)
      setIsPaymentReceived(true)

      setTimeout(() => {
        clearResult()
      }, 5000)
    }

    source.onerror = (e: any) => {
      console.error('error:', e)
      // TODO: handle error
    }

    return () => {
      source.close()
    }
  }, [isMounted])

  return (
    <div className="mt-4">
      {!isPaymentReceived && (
        <Fragment>
          <h1>Enter your amount (sats)</h1>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-4">
            <input
              className="p-3 w-full rounded border border-gray-700 bg-inherit"
              type="number"
              value={amountSat}
              min={0}
              autoFocus
              onChange={(e) => setAmountSat(parseInt(e.target.value.toLowerCase()))}
            />
            <button className="w-full h-[48px] p-3 rounded bg-gray-700" type="submit">
              {isLoading ? 'Loading...' : 'Create invoice'}
            </button>
          </form>
        </Fragment>
      )}

      {!!invoice && !isPaymentReceived && (
        <div className="flex flex-col">
          <div className="mx-auto mt-4">
            <QRCanvas text={invoice} options={{ width: 256 }} />
          </div>

          <div className="mt-3 mx-auto">
            {!copied ? (
              <button
                className="flex gap-1 rounded bg-gray-700 p-2 items-center"
                onClick={() => {
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                  copy(invoice)
                }}
              >
                <FaCopy className="cursor-pointer w-[32px] h-[32px]" />
                <span>Copy</span>
              </button>
            ) : (
              <p>Copied</p>
            )}
          </div>

          <button
            className="mt-3 p-2 rounded bg-gray-700"
            onClick={() => {
              setOpenInvoice(!openInvoice)
            }}
          >
            {openInvoice ? 'Hide invoice' : 'Show invoice'}
          </button>

          {openInvoice && <p className="mt-1 break-words">{invoice}</p>}
        </div>
      )}

      <Transition
        as={Fragment}
        show={isPaymentReceived}
        enter="transition ease duration-500 transform"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease duration-500 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-full"
      >
        <div
          className="flex flex-col items-center"
          onClick={() => {
            clearResult()
          }}
        >
          <div className="flex flex-col items-center mt-4 w-full h-full">
            <span className="text-2xl font-semibold">{receivedAmountSat} sats</span>
            <span className="mt-6 text-2xl font-semibold">Payment Received</span>
            <FaRegCheckCircle className="mt-6 w-[200px] h-[200px] text-green-500" />
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default Receive
