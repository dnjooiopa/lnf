'use client'

import { FC, useState } from 'react'
import { useQRCode } from 'next-qrcode'

const Receive: FC<{}> = () => {
  const { Canvas: QRCanvas } = useQRCode()

  const [amountSat, setAmountSat] = useState<number>(0)
  const [description, setDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>(
    'lnbc3210n1pnz3egppp5qvzujpneuemvkh5ywnaulv2x95n2f5aqlg47wds7g5yg3uufj3nscqpjsp5rcwvjjd0977wqwzr7208qrl63qfs9c922zat0tdwcuef8jyaq98q9q7sqqqqqqqqqqqqqqqqqqqsqqqqqysgqdqqmqz9grzjqwryaup9lh50kkranzgcdnn2fgvx390wgj5jd07rwr3vxeje0glcllugk4rqx4vp7cqqqqlgqqqqqeqqjq5fpcdtelmjttkxcgrwcfxnu0j3mmnhw0j9gln249e7szrx255q6q7jzxqa4pr6q250d0suyww88ys40cyqee67g6d27vjkdpp2h28ksp5v0slp'
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!(amountSat > 0 && amountSat < 2000000)) {
      return alert('Invalid amount')
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/lnf.createinvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSat, description }),
      })

      const data = await res.json()

      if (data?.error) {
        setIsLoading(false)
        return alert(data.error.code)
      }

      setInvoice(data.result.serialized)
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
          <div className="mx-auto mt-6">
            <QRCanvas text={invoice} />
          </div>
          <p className="mt-2 break-words">{invoice}</p>
        </div>
      )}
    </div>
  )
}

export default Receive
