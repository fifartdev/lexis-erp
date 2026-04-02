'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface PortalNavProps {
  userName: string
}

export function PortalNav({ userName }: PortalNavProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/api/media/file/Lexis-Agency-Athens-Lite-Logo.png"
            alt="Lexis Agency"
            width={110}
            height={36}
            className="object-contain"
            priority
          />
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/portal" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
            Αρχική
          </Link>
          <Link href="/portal/profile" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">
            Το Προφίλ μου
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-brand-700 text-xs font-bold">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors ml-1"
          >
            Αποσύνδεση
          </button>
        </div>
      </div>
    </header>
  )
}
