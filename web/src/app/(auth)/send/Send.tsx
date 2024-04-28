'use client'

import { Transition } from '@headlessui/react'
import { FC, Fragment, useState } from 'react'
import { FaRegCheckCircle } from 'react-icons/fa'
import { RiQrScan2Line, RiSendPlaneFill } from 'react-icons/ri'
import { toast } from 'react-toastify'

import { LnFService } from '@/services/lnf'
import { validInvoice } from '@/utils/invoice'
import QrScanModal from './QrScanModal'

const Send: FC<{}> = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>('')
  const [isOpenQRScan, setIsOpenQRScan] = useState<boolean>(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false)

  const clearResult = () => {
    setInvoice('')
    setIsPaymentSuccess(false)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validInvoice(invoice)) {
      return toast.error('Invalid invoice', {
        autoClose: 2000,
      })
    }

    setIsLoading(true)

    try {
      await LnFService.payInvoice({ invoice })
      setIsPaymentSuccess(true)
      setTimeout(() => {
        clearResult()
      }, 5000)
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }

  return (
    <div className="mt-4">
      {!isPaymentSuccess && (
        <Fragment>
          <h1>Enter invoice</h1>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-4">
            <input
              className="p-3 w-full rounded border border-gray-700 bg-inherit"
              type="text"
              value={invoice}
              min={0}
              autoFocus
              onChange={(e) => setInvoice(e.target.value)}
            />
            <div className="flex gap-2 w-full">
              <button
                type="submit"
                className="flex grow gap-1 items-center justify-center p-2 h-[48px] rounded bg-gray-700"
              >
                <RiSendPlaneFill className={`text-3xl text-gray-100`} />
                <span>{isLoading ? 'Loading...' : 'Send'}</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 justify-center py-2 px-6 rounded bg-gray-700"
                onClick={() => {
                  setIsOpenQRScan((prev) => !prev)
                }}
              >
                <RiQrScan2Line className="text-3xl" />
                <span>Scan</span>
              </button>
            </div>
          </form>

          {isOpenQRScan && <QrScanModal closeModal={() => setIsOpenQRScan(false)} setInvoice={setInvoice} />}
        </Fragment>
      )}

      <Transition
        as={Fragment}
        show={isPaymentSuccess}
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
            setIsPaymentSuccess(false)
          }}
        >
          <div className="flex flex-col items-center mt-4 w-full h-full">
            <span className="mt-6 text-2xl font-semibold">Payment Sent</span>
            <FaRegCheckCircle className="mt-6 w-[200px] h-[200px] text-green-500" />
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default Send
