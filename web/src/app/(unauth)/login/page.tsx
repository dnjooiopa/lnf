import { FC } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Login from './Login'

const Page: FC<{}> = () => {
  const { get } = cookies()
  const token = get('token')

  if (token?.value) {
    return redirect('/')
  }

  return (
    <div className="flex flex-col items-center">
      <Login />
    </div>
  )
}

export default Page
