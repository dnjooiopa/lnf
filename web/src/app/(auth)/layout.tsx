import MenuDropdown from '@/components/MenuDropdown'
import { AppContextProvider } from '@/contexts/AppContext'
import Providers from './providers'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Providers>
      <div className="p-4">
        <AppContextProvider>
          <MenuDropdown />
          <main className="mt-16 px-8 max-w-md mx-auto text-center">{children}</main>
        </AppContextProvider>
      </div>
    </Providers>
  )
}

export default Layout
