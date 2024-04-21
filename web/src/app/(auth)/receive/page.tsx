import { Fragment } from 'react'
import Link from 'next/link'

import Receive from './Receive'

interface IPageProps {}

const Page = ({}: IPageProps) => {
  return (
    <Fragment>
      <Link href="/">
        <button className="py-1 px-2 rounded border">{`<-back`}</button>
      </Link>
      <Receive />
    </Fragment>
  )
}

export default Page
