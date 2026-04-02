'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [clients, setClients] = useState<{ id: string; fullName: string }[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    expirationDate: '',
    serviceCategory: '',
    client: '',
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/services/${id}`, { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/clients?limit=200&sort=fullName', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/service-categories?limit=200&sort=name', { credentials: 'include' }).then((r) =>
        r.json(),
      ),
    ]).then(([serviceData, clientsData, catsData]) => {
      setForm({
        title: serviceData.title ?? '',
        description: serviceData.description ?? '',
        startDate: serviceData.startDate ? serviceData.startDate.split('T')[0] : '',
        expirationDate: serviceData.expirationDate
          ? serviceData.expirationDate.split('T')[0]
          : '',
        serviceCategory:
          typeof serviceData.serviceCategory === 'object'
            ? serviceData.serviceCategory?.id ?? ''
            : serviceData.serviceCategory ?? '',
        client:
          typeof serviceData.client === 'object'
            ? serviceData.client?.id ?? ''
            : serviceData.client ?? '',
      })
      setClients(clientsData.docs ?? [])
      setCategories(catsData.docs ?? [])
    }).finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body: any = {
        title: form.title,
        startDate: form.startDate,
        client: form.client || undefined,
        description: form.description || undefined,
        expirationDate: form.expirationDate || null,
        serviceCategory: form.serviceCategory || null,
      }

      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || 'Σφάλμα αποθήκευσης.')
        return
      }

      router.back()
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Είστε σίγουρος/η ότι θέλετε να διαγράψετε αυτή την υπηρεσία;')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE', credentials: 'include' })
    router.push('/dashboard/services')
  }

  if (fetching) return <div className="text-gray-400 text-sm p-6">Φόρτωση...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Επεξεργασία Υπηρεσίας</h2>
          <p className="text-gray-500 text-sm mt-0.5">{form.title}</p>
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
                  <option key={c.id} value={c.id}>{c.fullName}</option>
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
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <p className="mt-1 text-xs text-gray-400">Αφήστε κενό αν δεν λήγει</p>
              </div>
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
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Ακύρωση
            </button>
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
