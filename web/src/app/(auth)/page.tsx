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
    <main className="h-screen mt-24 text-center">
      <Balance unit={BalanceUnit.SATS} />
    </main>
  )
}

export default Page
