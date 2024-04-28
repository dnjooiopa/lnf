import { Fragment } from 'react'
import Link from 'next/link'

import Receive from './Receive'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <div className="flex items-start">
        <Link href="/">
          <button className="py-1 border-gray-700 font-semibold hover:underline">{`<-Home`}</button>
        </Link>
      </div>

      <Receive />
    </Fragment>
  )
}

export default Page
