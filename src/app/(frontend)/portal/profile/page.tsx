'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [clientId, setClientId] = useState('')
  const [form, setForm] = useState({
    email: '',
    mobilePhone: '',
    landlinePhone: '',
  })

  useEffect(() => {
    // Get the current user, then look up their client record
    fetch('/api/users/me', { credentials: 'include' })
      .then((r) => r.json())
      .then(async (userData) => {
        if (!userData?.user?.id) return
        const clientRes = await fetch(
          `/api/clients?where[linkedUser][equals]=${userData.user.id}&limit=1`,
          { credentials: 'include' },
        )
        const clientData = await clientRes.json()
        const client = clientData.docs?.[0]
        if (client) {
          setClientId(client.id)
          setForm({
            email: client.email ?? '',
            mobilePhone: client.mobilePhone ?? '',
            landlinePhone: client.landlinePhone ?? '',
          })
        }
      })
      .finally(() => setFetching(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          mobilePhone: form.mobilePhone || null,
          landlinePhone: form.landlinePhone || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || 'Σφάλμα αποθήκευσης.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Προέκυψε σφάλμα. Παρακαλώ δοκιμάστε ξανά.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-gray-400 text-sm">Φόρτωση...</div>

  return (
    <div className="max-w-md">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/portal" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Το Προφίλ μου</h2>
          <p className="text-gray-500 text-sm mt-0.5">Επεξεργασία στοιχείων επικοινωνίας</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Τα στοιχεία σας αποθηκεύτηκαν επιτυχώς.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            Μπορείτε να ενημερώσετε μόνο τα στοιχεία επικοινωνίας σας. Για άλλες αλλαγές, επικοινωνήστε με τη Lexis Agency.
          </p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Κινητό Τηλέφωνο</label>
            <input
              type="tel"
              value={form.mobilePhone}
              onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              placeholder="69XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Σταθερό Τηλέφωνο</label>
            <input
              type="tel"
              value={form.landlinePhone}
              onChange={(e) => setForm({ ...form, landlinePhone: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 text-sm"
              placeholder="21XXXXXXXX"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || !clientId}
            className="px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
          </button>
          <Link
            href="/portal"
            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ακύρωση
          </Link>
        </div>
      </form>
    </div>
  )
}
