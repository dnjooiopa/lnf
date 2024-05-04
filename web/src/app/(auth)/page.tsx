import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Balance from '@/components/Balance'
import Transactions from '@/components/Transactions'
import Button from '@/components/base/Button'

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
          <Button className="w-[128px]">Receive</Button>
        </Link>
        <Link href="/send">
          <Button className="w-[128px]">Send</Button>
        </Link>
      </div>
      <div className="mt-4" />
      <Transactions />
    </div>
  )
}

export default Page
