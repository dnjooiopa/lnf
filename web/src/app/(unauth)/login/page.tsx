import { FC, Fragment } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import Login from './login'

const Page: FC<{}> = () => {
  const { get } = cookies()
  const token = get('token')

  if (token?.value) {
    return redirect('/')
  }

  return (
    <Fragment>
      <Login />
    </Fragment>
  )
}

export default Page
