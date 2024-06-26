'use client'

import { FC, Fragment, PropsWithChildren, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { EventSourcePolyfill } from 'event-source-polyfill'

import { EventType } from '@/enums'
import { EventMessage } from '@/types'
import { PayInvoiceResult, Transaction } from '@/types/lnf'

const toastAutoCloseMills = 5000 // 5 seconds

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const token = Cookies.get('token')
  const { push } = useRouter()

  useEffect(() => {
    if (!token) {
      push('/login')
    }

    // NOTE: disable event source for now
    return

    const source = new EventSourcePolyfill(`/api/event.subscribe`)

    source.onmessage = (e) => {
      const event = JSON.parse(e.data) as EventMessage
      switch (event?.type) {
        case EventType.PAYMENT_RECEIVED:
          const data = event.data as Transaction
          const msg = `Received ${data.amountSat} sats`
          toast.success(msg, {
            autoClose: toastAutoCloseMills,
          })
          break
        case EventType.PAYMENT_SENT:
          const data2 = event.data as PayInvoiceResult
          const msg2 = `Sent ${data2.recipientAmountSat} sats`
          toast.success(msg2, {
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

  return <Fragment>{children}</Fragment>
}

export default Providers
