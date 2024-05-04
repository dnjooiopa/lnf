import { ButtonHTMLAttributes, FC } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<IButtonProps> = ({ className, children, ...props }) => {
  return (
    <button className={`rounded p-2 bg-gray-700 hover:bg-gray-600 hover:text-gray-50 ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
