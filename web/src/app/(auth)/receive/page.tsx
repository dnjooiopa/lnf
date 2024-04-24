import { Fragment } from 'react'
import Link from 'next/link'

import Receive from './Receive'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <div className="flex items-start mb-8">
        <Link href="/">
          <button className="py-1 px-2 rounded border border-gray-700">{`<-back`}</button>
        </Link>
      </div>

      <Receive />
    </Fragment>
  )
}

export default Page
