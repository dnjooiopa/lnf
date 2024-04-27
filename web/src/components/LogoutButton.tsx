'use client'

import { useRouter } from 'next/navigation'

import Axios from '@/libs/axios'

const LogoutButton = () => {
  const { push } = useRouter()

  const handleLogout = async () => {
    try {
      const res = await Axios.post('/auth/logout', {})
      if (res?.ok) push('/login')
    } catch (err) {}
  }

  return (
    <button className="p-2" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton
