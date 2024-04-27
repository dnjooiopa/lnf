'use client'

import { FC, Fragment, PropsWithChildren, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify'
import { EventSourcePolyfill } from 'event-source-polyfill'

import { EventType } from '@/enums'
import { EventMessage } from '@/types'
import { Transaction } from '@/types/lnf'

const toastAutoCloseMills = 10000 // 10 seconds

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const token = Cookies.get('token')
  const { push } = useRouter()

  useEffect(() => {
    if (!token) {
      push('/login')
    }

    const source = new EventSourcePolyfill(`/api/event.subscribe`)

    source.onmessage = (e) => {
      console.log('event:', e)
      const event = JSON.parse(e.data) as EventMessage
      switch (event?.type) {
        case EventType.PAYMENT_RECEIVED:
          const data = event.data as Transaction
          const msg = `Received ${data.amountSat} sats`
          toast.success(msg, {
            autoClose: toastAutoCloseMills,
          })
          break
      }
    }

    source.onerror = (e: any) => {
      console.error('error:', e)
      // TODO: handle error
    }

    return () => {
      source.close()
    }
  }, [token])

  return (
    <Fragment>
      {children}
      <ToastContainer />
    </Fragment>
  )
}

export default Providers
