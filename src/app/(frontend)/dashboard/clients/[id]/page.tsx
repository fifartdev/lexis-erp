import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function getExpirationBadge(expirationDate: string | null | undefined) {
  if (!expirationDate) return <span className="badge-no-expiry">Χωρίς λήξη</span>
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expirationDate)
  exp.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / 86_400_000)
  if (daysLeft < 0) return <span className="badge-expired">Έληξε</span>
  if (daysLeft <= 3) return <span className="badge-critical">{daysLeft}ημ. απομένουν</span>
  if (daysLeft <= 30) return <span className="badge-expiring">{daysLeft} ημ. απομένουν</span>
  return <span className="badge-active">Ενεργή</span>
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  let client: any
  try {
    client = await payload.findByID({
      collection: 'clients',
      id,
      depth: 2,
      overrideAccess: true,
    })
  } catch {
    notFound()
  }

  const { docs: services } = await payload.find({
    collection: 'services',
    where: { client: { equals: id } },
    depth: 1,
    overrideAccess: true,
    sort: 'expirationDate',
  })

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/clients" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{client.fullName}</h2>
            <p className="text-gray-500 text-sm">{client.email}</p>
          </div>
        </div>
        <Link
          href={`/dashboard/clients/${id}/edit`}
          className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          Επεξεργασία
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Στοιχεία Επικοινωνίας</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{client.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Κινητό</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{client.mobilePhone || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Σταθερό</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{client.landlinePhone || '—'}</dd>
            </div>
            {client.description && (
              <div>
                <dt className="text-gray-500">Σημειώσεις</dt>
                <dd className="text-gray-700 mt-0.5 whitespace-pre-wrap">{client.description}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Services */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Υπηρεσίες ({services.length})
              </h3>
              <Link
                href={`/dashboard/services/new?clientId=${id}`}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                + Νέα Υπηρεσία
              </Link>
            </div>
            {services.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">
                Δεν υπάρχουν υπηρεσίες για αυτόν τον πελάτη ακόμα.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {services.map((service) => (
                  <div key={service.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{service.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {typeof service.serviceCategory === 'object' && service.serviceCategory && (
                          <span className="text-xs text-gray-400">
                            {(service.serviceCategory as any).name}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          Έναρξη: {new Date(service.startDate).toLocaleDateString('el-GR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {getExpirationBadge(service.expirationDate as string | null)}
                      <Link
                        href={`/dashboard/services/${service.id}/edit`}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Επεξ.
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
