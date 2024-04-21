import { Fragment } from 'react'
import Link from 'next/link'

import Send from './Send'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <Link href="/">
        <button className="py-1 px-2 rounded border">{`<-back`}</button>
      </Link>

      <Send />
    </Fragment>
  )
}

export default Page
