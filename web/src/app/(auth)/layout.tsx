import LogoutButton from '@/components/LogoutButton'
import Providers from './providers'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Providers>
      <div className="p-4">
        <LogoutButton />
        <main className="max-w-md mx-auto mt-24 text-center">{children}</main>
      </div>
    </Providers>
  )
}

export default Layout
