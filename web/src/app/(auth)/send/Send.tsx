'use client'

import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { RiQrScan2Line, RiSendPlaneFill } from 'react-icons/ri'
import { toast } from 'react-toastify'

import { LnFService } from '@/services/lnf'
import { validInvoice } from '@/utils/invoice'
import QrScanModal from './QrScanModal'

const Send: FC<{}> = () => {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>('')
  const [isOpenQRScan, setIsOpenQRScan] = useState<boolean>(false)

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
      push('/')
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }

  return (
    <div className="mt-4">
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
            <span>Send</span>
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

      {isLoading && <p>Loading...</p>}
    </div>
  )
}

export default Send
