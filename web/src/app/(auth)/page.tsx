import { Fragment } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Balance from '@/components/Balance'
import { BalanceUnit } from '@/enums'

const Page = () => {
  const { get } = cookies()
  const token = get('token')

  if (!token?.value) {
    return redirect('/login')
  }

  // TODO: validate token

  return (
    <Fragment>
      <Balance unit={BalanceUnit.SATS} />
    </Fragment>
  )
}

export default Page
