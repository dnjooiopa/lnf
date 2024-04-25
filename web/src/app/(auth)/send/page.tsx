import { Fragment } from 'react'
import Link from 'next/link'

import Send from './Send'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <div className="flex items-start">
        <Link href="/">
          <button className="py-1 px-2 rounded border border-gray-700">{`<-back`}</button>
        </Link>
      </div>

      <Send />
    </Fragment>
  )
}

export default Page
