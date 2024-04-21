'use client'

import { useRouter } from 'next/navigation'

const LogoutButton = () => {
  const { push } = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await res.json()

      if (data?.ok) {
        push('/login')
      }
    } catch (err) {}
  }

  return (
    <button className="p-2 rounded border" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton
