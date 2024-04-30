import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Balance from '@/components/Balance'
import { BalanceUnit } from '@/enums'
import Transactions from '@/components/Transactions'

const Page = () => {
  const { get } = cookies()
  const token = get('token')

  if (!token?.value) {
    return redirect('/login')
  }

  // TODO: validate token

  return (
    <div className="mt-20">
      <Balance />
      <div className="flex mt-4 gap-4 justify-center">
        <Link href="/receive">
          <button className="w-[128px] rounded p-2 bg-gray-700">
            <span>Receive</span>
          </button>
        </Link>
        <Link href="/send">
          <button className="w-[128px] rounded p-2 bg-gray-700">
            <span>Send</span>
          </button>
        </Link>
      </div>
      <div className="mt-4" />
      <Transactions />
    </div>
  )
}

export default Page
