'use client'

import { FC, PropsWithChildren, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const token = Cookies.get('token')
  const { push } = useRouter()

  useEffect(() => {
    if (!token) {
      push('/login')
    }

    return () => {}
  }, [token])

  return children
}

export default Providers
