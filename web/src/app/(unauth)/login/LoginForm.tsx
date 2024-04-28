'use client'

import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { toast } from 'react-toastify'

import { AuthService } from '@/services/auth'
import { IBaseResponseError } from '@/types'
import { ErrorCode } from '@/enums'

const Login: FC<{}> = () => {
  const { replace } = useRouter()
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await AuthService.login({ pin })
      replace('/')
    } catch (e) {
      const err = e as IBaseResponseError
      if (err?.code === ErrorCode.INVALID_PIN) {
        toast.error('Invalid pin', {
          autoClose: 3000,
        })
      }
    }

    setIsLoading(false)
  }

  return (
    <form className="mt-40 w-full max-w-[400px] px-6" onSubmit={handleSubmit}>
      <input
        className="p-3 w-full rounded border border-gray-700 bg-inherit"
        placeholder="Enter your pin"
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        autoFocus
      />
      <button className="py-2 rounded w-full h-[48px] mt-2 bg-gray-700" type="submit">
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}

export default Login
