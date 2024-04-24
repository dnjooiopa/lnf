import Providers from './providers'
import MenuDropdown from '@/components/MenuDropdown'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Providers>
      <div className="p-4">
        <MenuDropdown />
        <main className="max-w-md mx-auto text-center">{children}</main>
      </div>
    </Providers>
  )
}

export default Layout
