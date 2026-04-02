import { requireAdminOrSuperAdmin } from '@/lib/auth'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminOrSuperAdmin()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-sm font-medium text-gray-500">Lexis Agency ERP</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-brand-700 text-xs font-bold">
                {(user.name ?? user.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user.name ?? user.email}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </header>
        {/* Main */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
