'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'

const Send: FC<{}> = () => {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invoice, setInvoice] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!invoice) {
      return alert('Invalid invoice')
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/lnf.payinvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice }),
      })

      const data = await res.json()

      if (data?.error) {
        setIsLoading(false)
        return alert(data.error.code)
      }

      alert('Payment sent')
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
          className="p-3 rounded border w-full"
          type="text"
          value={invoice}
          min={0}
          autoFocus
          onChange={(e) => setInvoice(e.target.value)}
        />
        <button className="w-full p-3 rounded border bg-emerald-300" type="submit">
          Send
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
    </div>
  )
}

export default Send
