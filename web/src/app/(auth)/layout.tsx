import LogoutButton from '@/components/LogoutButton'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="p-4">
      <LogoutButton />
      <main className="max-w-md mx-auto mt-24 text-center">{children}</main>
    </div>
  )
}

export default Layout
