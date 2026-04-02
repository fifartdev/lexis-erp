import { requireRole } from '@/lib/auth'
import { PortalNav } from '@/components/portal/PortalNav'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('client')

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav userName={user.name ?? user.email} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  )
}
