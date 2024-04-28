import { FC } from 'react'

import './burger.css'

interface IBurgerCloseProps {
  isClosed: boolean
  className?: string
}

const BurgerCloseIcon: FC<IBurgerCloseProps> = ({ isClosed, className }) => (
  <div className={className}>
    <span className={`burger burger-close ${isClosed ? 'is-closed' : ''}`} />
  </div>
)

export default BurgerCloseIcon
