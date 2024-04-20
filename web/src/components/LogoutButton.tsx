'use client'

import { useRouter } from 'next/navigation'

const LogoutButton = () => {
  const { push } = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch('/auth/logout', {
        method: 'POST',
      })

      const data = await res.json()

      if (data?.ok) {
        push('/login')
      }
    } catch (err) {}
  }

  return <button onClick={handleLogout}>Logout</button>
}

export default LogoutButton
