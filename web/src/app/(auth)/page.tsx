import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Balance from '@/components/Balance'
import { BalanceUnit } from '@/enums'
import Transaction from '@/components/Transaction'

const Page = () => {
  const { get } = cookies()
  const token = get('token')

  if (!token?.value) {
    return redirect('/login')
  }

  // TODO: validate token

  return (
    <div>
      <Balance unit={BalanceUnit.SATS} />

      <div className="mt-4" />
      <Transaction />
    </div>
  )
}

export default Page
