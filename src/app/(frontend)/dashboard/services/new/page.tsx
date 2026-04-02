'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function NewServiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') || ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<{ id: string; fullName: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    expirationDate: '',
    serviceCategory: '',
    client: preselectedClientId,
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/clients?limit=200&sort=fullName', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/service-categories?limit=200&sort=name', { credentials: 'include' }).then((r) =>
        r.json(),
      ),
    ]).then(([clientsData, catsData]) => {
      setClients(clientsData.docs ?? [])
      setCategories(catsData.docs ?? [])
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body: any = {
        title: form.title,
        startDate: form.startDate,
        client: form.client ? Number(form.client) : undefined,
      }
      if (form.description) body.description = form.description
      if (form.expirationDate) body.expirationDate = form.expirationDate
      if (form.serviceCategory) body.serviceCategory = Number(form.serviceCategory)

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.errors?.[0]?.message || 'Σφάλμα δημιουργίας υπηρεσίας.')
        return
      }

      if (form.client) {
        router.push(`/dashboard/clients/${form.client}`)
      } else {
        router.push('/dashboard/services')
      }
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/dashboard/services" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Νέα Υπηρεσία</h2>
          <p className="text-gray-500 text-sm mt-0.5">Δημιουργία νέας υπηρεσίας πελάτη</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Τίτλος Υπηρεσίας <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                placeholder="π.χ. SEO Βελτιστοποίηση"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Περιγραφή</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Πελάτης <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              >
                <option value="">Επιλέξτε πελάτη...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Κατηγορία</label>
              <select
                value={form.serviceCategory}
                onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              >
                <option value="">Χωρίς κατηγορία</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ημ. Έναρξης <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ημ. Λήξης</label>
                <input
                  type="date"
                  value={form.expirationDate}
                  onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                />
                <p className="mt-1 text-xs text-gray-400">Προαιρετικό αν η υπηρεσία δεν λήγει</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Αποθήκευση...' : 'Δημιουργία Υπηρεσίας'}
          </button>
          <Link
            href="/dashboard/services"
            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  )
}

export default function NewServicePage() {
  return (
    <Suspense>
      <NewServiceForm />
    </Suspense>
  )
}
