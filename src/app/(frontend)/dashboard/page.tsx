import { getPayload } from 'payload'
import config from '@/payload.config'
import { StatCard } from '@/components/admin/StatCard'
import Link from 'next/link'

export default async function DashboardPage() {
  const payload = await getPayload({ config })

  const [clientsResult, servicesResult] = await Promise.all([
    payload.find({ collection: 'clients', limit: 0, overrideAccess: true }),
    payload.find({
      collection: 'services',
      limit: 0,
      overrideAccess: true,
    }),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in30Days = new Date(today)
  in30Days.setDate(today.getDate() + 30)

  const expiringSoonResult = await payload.find({
    collection: 'services',
    where: {
      and: [
        { expirationDate: { exists: true } },
        { expirationDate: { greater_than_equal: today.toISOString() } },
        { expirationDate: { less_than_equal: in30Days.toISOString() } },
      ],
    },
    limit: 5,
    depth: 1,
    overrideAccess: true,
    sort: 'expirationDate',
  })

  const expiredResult = await payload.find({
    collection: 'services',
    where: {
      and: [
        { expirationDate: { exists: true } },
        { expirationDate: { less_than: today.toISOString() } },
      ],
    },
    limit: 0,
    overrideAccess: true,
  })

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Πίνακας Ελέγχου</h2>
        <p className="text-gray-500 text-sm mt-1">
          Καλώς ορίσατε στο Lexis Agency ERP
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Σύνολο Πελατών"
          value={clientsResult.totalDocs}
          color="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Σύνολο Υπηρεσιών"
          value={servicesResult.totalDocs}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Λήγουν (30 ημέρες)"
          value={expiringSoonResult.totalDocs}
          color="yellow"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Ληγμένες Υπηρεσίες"
          value={expiredResult.totalDocs}
          color="red"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Expiring soon table */}
      {expiringSoonResult.docs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Υπηρεσίες που Λήγουν Σύντομα</h3>
            <Link href="/dashboard/services" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Προβολή όλων →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Υπηρεσία</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Πελάτης</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ημ. Λήξης</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expiringSoonResult.docs.map((service) => {
                  const expDate = new Date(service.expirationDate as string)
                  const daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / 86_400_000)
                  const badgeClass =
                    daysLeft <= 3
                      ? 'badge-critical'
                      : daysLeft <= 14
                        ? 'badge-expiring'
                        : 'badge-expiring'
                  return (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link href={`/dashboard/services/${service.id}/edit`} className="hover:text-brand-600">
                          {service.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {typeof service.client === 'object' && service.client
                          ? (service.client as any).fullName
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {expDate.toLocaleDateString('el-GR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={badgeClass}>
                          {daysLeft === 1 ? '1 ημέρα' : `${daysLeft} ημέρες`}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
