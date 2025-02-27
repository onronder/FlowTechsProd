import { AuthLayout } from "@/components/auth/auth-layout"

export default function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AuthLayout
      title="Welcome to FlowTechs"
      subtitle="Manage your data flows with ease"
    >
      {children}
    </AuthLayout>
  )
}

