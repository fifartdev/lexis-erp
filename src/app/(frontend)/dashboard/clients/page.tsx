import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export default async function ClientsPage() {
  const payload = await getPayload({ config })
  const { docs: clients } = await payload.find({
    collection: 'clients',
    limit: 200,
    depth: 0,
    overrideAccess: true,
    sort: 'fullName',
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Πελάτες</h2>
          <p className="text-gray-500 text-sm mt-1">{clients.length} πελάτες στο σύστημα</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Νέος Πελάτης
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {clients.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="font-medium">Δεν υπάρχουν πελάτες ακόμα</p>
            <Link href="/dashboard/clients/new" className="mt-2 inline-block text-sm text-brand-600 hover:text-brand-700">
              Προσθέστε τον πρώτο πελάτη →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ονοματεπώνυμο</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Κινητό</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Σταθερό</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{client.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{client.email}</td>
                    <td className="px-6 py-4 text-gray-600">{client.mobilePhone || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{client.landlinePhone || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                        >
                          Προβολή
                        </Link>
                        <Link
                          href={`/dashboard/clients/${client.id}/edit`}
                          className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Επεξεργασία
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
