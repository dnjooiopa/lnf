import LogoutButton from '@/components/LogoutButton'

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <LogoutButton />
      <main className="h-screen mt-24 text-center">{children}</main>
    </div>
  )
}

export default Layout
