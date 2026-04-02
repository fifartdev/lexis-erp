'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobilePhone: '',
    landlinePhone: '',
    description: '',
  })

  useEffect(() => {
    fetch(`/api/clients/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          fullName: data.fullName ?? '',
          email: data.email ?? '',
          mobilePhone: data.mobilePhone ?? '',
          landlinePhone: data.landlinePhone ?? '',
          description: data.description ?? '',
        })
      })
      .finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || 'Σφάλμα αποθήκευσης.')
        return
      }
      router.push(`/dashboard/clients/${id}`)
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Είστε σίγουρος/η ότι θέλετε να διαγράψετε αυτόν τον πελάτη;')) return
    await fetch(`/api/clients/${id}`, { method: 'DELETE', credentials: 'include' })
    router.push('/dashboard/clients')
  }

  if (fetching) {
    return <div className="text-gray-400 text-sm p-6">Φόρτωση...</div>
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/dashboard/clients/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Επεξεργασία Πελάτη</h2>
          <p className="text-gray-500 text-sm mt-0.5">{form.fullName}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Στοιχεία Πελάτη</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ονοματεπώνυμο <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Κινητό Τηλέφωνο</label>
                <input
                  type="tel"
                  value={form.mobilePhone}
                  onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Σταθερό Τηλέφωνο</label>
                <input
                  type="tel"
                  value={form.landlinePhone}
                  onChange={(e) => setForm({ ...form, landlinePhone: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Σημειώσεις</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
            <Link
              href={`/dashboard/clients/${id}`}
              className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Ακύρωση
            </Link>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2.5 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Διαγραφή
          </button>
        </div>
      </form>
    </div>
  )
}
