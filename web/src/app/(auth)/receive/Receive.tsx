'use client'

import { FC, useState } from 'react'
import { useQRCode } from 'next-qrcode'
import { useCopyToClipboard } from 'usehooks-ts'
import { FaCopy } from 'react-icons/fa'

import Axios from '@/libs/axios'

const Receive: FC<{}> = () => {
  const { Canvas: QRCanvas } = useQRCode()

  const [amountSat, setAmountSat] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [openInvoice, setOpenInvoice] = useState<boolean>(false)

  const [_, copy] = useCopyToClipboard()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!(amountSat > 0 && amountSat < 2000000)) {
      return alert('Invalid amount')
    }

    setIsLoading(true)

    try {
      const res = await Axios.post('/lnf.createinvoice', { amountSat, description })
      if (res?.error) {
        setIsLoading(false)
        return alert(res.error.code)
      }

      setInvoice(res.result.serialized)
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }

  return (
    <div className="mt-4">
      <h1>Enter your amount</h1>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-4">
        <input
          className="p-3 w-full rounded border border-gray-700 bg-inherit"
          type="number"
          value={amountSat}
          min={0}
          autoFocus
          onChange={(e) => setAmountSat(parseInt(e.target.value))}
        />
        <button className="w-full p-3 rounded bg-gray-700" type="submit">
          Create invoice
        </button>
      </form>

      {isLoading && <p>Loading...</p>}

      {invoice && (
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
    </div>
  )
}

export default Receive
