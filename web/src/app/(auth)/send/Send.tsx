'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'

import Axios from '@/libs/axios'

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
      const res = await Axios.post('/lnf.payinvoice', { invoice })
      if (res?.error) {
        setIsLoading(false)
        return alert(res.error.code)
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
          className="p-3 w-full rounded border border-gray-700 bg-inherit"
          type="text"
          value={invoice}
          min={0}
          autoFocus
          onChange={(e) => setInvoice(e.target.value)}
        />
        <button className="w-full p-3 rounded bg-gray-700" type="submit">
          Send
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
    </div>
  )
}

export default Send
