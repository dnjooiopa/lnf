'use client'

import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

import Axios from '@/libs/axios'

const Login: FC<{}> = () => {
  const { replace } = useRouter()
  const [pin, setPin] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await Axios.post('/auth/login', { pin })
      replace('/')
    } catch (e) {}
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
