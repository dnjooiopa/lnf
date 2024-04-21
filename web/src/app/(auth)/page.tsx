import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div className="mt-20">
      <Balance unit={BalanceUnit.SATS} />
      <div className="mt-4">
        <Link href="/receive">
          <button className="rounded border p-2 bg-emerald-300">
            <span>Receive</span>
          </button>
        </Link>
      </div>
      <div className="mt-4" />
      <Transaction />
    </div>
  )
}

export default Page
