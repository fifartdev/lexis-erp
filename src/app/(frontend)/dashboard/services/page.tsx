import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

function getExpirationBadge(expirationDate: string | null | undefined) {
  if (!expirationDate) return <span className="badge-no-expiry">Χωρίς λήξη</span>
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expirationDate)
  exp.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / 86_400_000)
  if (daysLeft < 0) return <span className="badge-expired">Έληξε</span>
  if (daysLeft <= 3) return <span className="badge-critical">{daysLeft}ημ.</span>
  if (daysLeft <= 30) return <span className="badge-expiring">{daysLeft}ημ.</span>
  return <span className="badge-active">Ενεργή</span>
}

export default async function ServicesPage() {
  const payload = await getPayload({ config })
  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 200,
    depth: 1,
    overrideAccess: true,
    sort: '-createdAt',
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Υπηρεσίες</h2>
          <p className="text-gray-500 text-sm mt-1">{services.length} υπηρεσίες στο σύστημα</p>
        </div>
        <Link
          href="/dashboard/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Νέα Υπηρεσία
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {services.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <p className="font-medium">Δεν υπάρχουν υπηρεσίες ακόμα</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Τίτλος</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Πελάτης</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Κατηγορία</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Έναρξη</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Λήξη</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Κατάσταση</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {typeof service.client === 'object' && service.client
                        ? (service.client as any).fullName
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {typeof service.serviceCategory === 'object' && service.serviceCategory
                        ? (service.serviceCategory as any).name
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(service.startDate).toLocaleDateString('el-GR')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {service.expirationDate
                        ? new Date(service.expirationDate as string).toLocaleDateString('el-GR')
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {getExpirationBadge(service.expirationDate as string | null)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/services/${service.id}/edit`}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Επεξεργασία
                      </Link>
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
