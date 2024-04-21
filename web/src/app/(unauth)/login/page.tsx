import { FC } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import LoginForm from './LoginForm'

const Page: FC<{}> = () => {
  const { get } = cookies()
  const token = get('token')

  if (token?.value) {
    return redirect('/')
  }

  return (
    <div className="flex flex-col items-center">
      <LoginForm />
    </div>
  )
}

export default Page
