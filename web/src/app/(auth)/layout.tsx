import { Fragment } from 'react'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <Fragment>{children}</Fragment>
}

export default Layout
