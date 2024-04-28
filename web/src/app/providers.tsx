import { FC, Fragment, PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Fragment>
      {children}
      <ToastContainer />
    </Fragment>
  )
}

export default Providers
