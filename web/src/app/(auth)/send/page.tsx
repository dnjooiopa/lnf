import { Fragment } from 'react'
import Link from 'next/link'

import Send from './Send'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <div className="flex items-start">
        <Link href="/">
          <button className="py-1 border-gray-700 font-semibold hover:underline">{`<-Home`}</button>
        </Link>
      </div>

      <Send />
    </Fragment>
  )
}

export default Page
