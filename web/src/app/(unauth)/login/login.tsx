'use client'

import { useRouter } from 'next/navigation'
import { FC, Fragment, useState } from 'react'

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
    <Fragment>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Enter your PIN:</span>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
        </label>
        <button type="submit">Login</button>
      </form>
    </Fragment>
  )
}

export default Login
