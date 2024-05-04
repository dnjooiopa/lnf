import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import Balance from '@/components/Balance'
import Transactions from '@/components/Transactions'
import Button from '@/components/base/Button'
import { RiSendPlaneFill } from 'react-icons/ri'

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
          <Button className="w-[128px] flex justify-center gap-2">
            <RiSendPlaneFill className={`text-2xl text-gray-100 rotate-90`} />
            <span>Receive</span>
          </Button>
        </Link>
        <Link href="/send">
          <Button className="w-[128px] flex justify-center gap-1">
            <RiSendPlaneFill className={`text-2xl text-gray-100`} />
            <span>Send</span>
          </Button>
        </Link>
      </div>
      <div className="mt-4" />
      <Transactions />
    </div>
  )
}

export default Page
