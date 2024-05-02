'use client'

import { useRouter } from 'next/navigation'

import { AuthService } from '@/services/auth'

const LogoutButton = () => {
  const { push } = useRouter()

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      push('/login')
    } catch (err) {}
  }

  return (
    <button className="p-2 w-full text-left" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton
