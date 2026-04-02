'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setError('Λανθασμένο email ή κωδικός πρόσβασης.')
        return
      }

      const role = data?.user?.role

      if (role === 'superadmin') {
        router.push('/admin')
      } else if (role === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/portal')
      }
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1433] px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/api/media/file/Lexis-Agency-Athens-Lite-Logo.png"
              alt="Lexis Agency"
              width={160}
              height={54}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-white/50 mt-1 text-sm">Σύνδεση στο σύστημα</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Εισαγωγή στοιχείων</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Κωδικός Πρόσβασης
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Σύνδεση...' : 'Σύνδεση'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          &copy; {new Date().getFullYear()} Lexis Agency ERP
        </p>
      </div>
    </div>
  )
}
