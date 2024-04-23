'use client'

import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

const Login: FC<{}> = () => {
  const { replace } = useRouter()
  const [pin, setPin] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })

    const data = await res.json()

    if (data?.error) {
      return alert(data.error.code)
    }

    replace('/')
  }

  return (
    <form className="mt-20 w-full max-w-[400px] px-6" onSubmit={handleSubmit}>
      <input
        className="p-3 w-full rounded border border-gray-700 bg-inherit"
        placeholder="Enter your pin"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        autoFocus
      />
      <button className="py-2 rounded w-full mt-2 bg-gray-700" type="submit">
        Login
      </button>
    </form>
  )
}

export default Login
