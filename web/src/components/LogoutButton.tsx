'use client'

import { useRouter } from 'next/navigation'

import Axios from '@/libs/axios'

const LogoutButton = () => {
  const { push } = useRouter()

  const handleLogout = async () => {
    try {
      await Axios.post('/auth/logout', {})
      push('/login')
    } catch (err) {}
  }

  return (
    <button className="p-2" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton
