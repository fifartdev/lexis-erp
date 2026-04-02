'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    const email = data.get('email') as string
    const password = data.get('password') as string
    const fullName = data.get('fullName') as string
    const landlinePhone = data.get('landlinePhone') as string
    const mobilePhone = data.get('mobilePhone') as string
    const description = data.get('description') as string

    try {
      // 1. Create the user account
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role: 'client',
        }),
      })

      const userData = await userRes.json()

      if (!userRes.ok) {
        setError(userData?.errors?.[0]?.message || 'Σφάλμα δημιουργίας λογαριασμού.')
        return
      }

      // 2. Create the client record
      const clientRes = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          email,
          landlinePhone: landlinePhone || undefined,
          mobilePhone: mobilePhone || undefined,
          description: description || undefined,
          linkedUser: Number(userData.doc.id),
        }),
      })

      const clientData = await clientRes.json()

      if (!clientRes.ok) {
        setError(clientData?.errors?.[0]?.message || 'Σφάλμα δημιουργίας πελάτη.')
        return
      }

      router.push(`/dashboard/clients/${clientData.doc.id}`)
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/clients" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Νέος Πελάτης</h2>
          <p className="text-gray-500 text-sm mt-0.5">Δημιουργία πελάτη και λογαριασμού πρόσβασης</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Στοιχεία Πελάτη</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ονοματεπώνυμο <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                type="text"
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                placeholder="π.χ. Γιώργος Παπαδόπουλος"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                placeholder="client@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Κινητό Τηλέφωνο</label>
                <input
                  name="mobilePhone"
                  type="tel"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                  placeholder="69XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Σταθερό Τηλέφωνο</label>
                <input
                  name="landlinePhone"
                  type="tel"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                  placeholder="21XXXXXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Σημειώσεις</label>
              <textarea
                name="description"
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Login credentials */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-1">Στοιχεία Πρόσβασης</h3>
          <p className="text-sm text-gray-500 mb-4">
            Ο πελάτης θα χρησιμοποιήσει αυτά τα στοιχεία για σύνδεση στην πύλη.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Κωδικός Πρόσβασης <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              placeholder="Τουλάχιστον 8 χαρακτήρες"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Αποθήκευση...' : 'Δημιουργία Πελάτη'}
          </button>
          <Link
            href="/dashboard/clients"
            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  )
}
