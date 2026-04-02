import { getAuthUser } from '@/lib/auth'
import { getClientByUser } from '@/lib/getClientByUser'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { redirect } from 'next/navigation'

function getExpirationStatus(expirationDate: string | null | undefined) {
  if (!expirationDate) {
    return { label: 'Χωρίς λήξη', className: 'badge-no-expiry' }
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expirationDate)
  exp.setHours(0, 0, 0, 0)
  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / 86_400_000)

  if (daysLeft < 0) return { label: 'Έληξε', className: 'badge-expired' }
  if (daysLeft <= 3) return { label: `${daysLeft} ημέρ${daysLeft === 1 ? 'α' : 'ες'} απομένουν`, className: 'badge-critical' }
  if (daysLeft <= 30) return { label: `${daysLeft} ημέρες απομένουν`, className: 'badge-expiring' }
  return { label: 'Ενεργή', className: 'badge-active' }
}

export default async function PortalPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')

  const client = await getClientByUser(user.id)
  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Ο λογαριασμός σας δεν έχει συνδεθεί με πελάτη ακόμα.</p>
        <p className="text-gray-400 text-sm mt-1">Παρακαλώ επικοινωνήστε με τη Lexis Agency.</p>
      </div>
    )
  }

  const payload = await getPayload({ config })
  const { docs: services } = await payload.find({
    collection: 'services',
    where: { client: { equals: client.id } },
    depth: 1,
    overrideAccess: true,
    sort: 'expirationDate',
  })

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Καλώς ορίσατε, {client.fullName}!</h2>
        <p className="text-gray-500 text-sm mt-1">Εδώ μπορείτε να δείτε τις υπηρεσίες σας.</p>
      </div>

      {/* Profile summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Τα Στοιχεία μου</h3>
          <Link
            href="/portal/profile"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Επεξεργασία →
          </Link>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
        </dl>
      </div>

      {/* Services */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Οι Υπηρεσίες μου ({services.length})
        </h3>

        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-12 text-center text-gray-400">
            <p>Δεν υπάρχουν υπηρεσίες ακόμα.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const status = getExpirationStatus(service.expirationDate as string | null)
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{service.title}</p>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          {typeof service.serviceCategory === 'object' &&
                            service.serviceCategory && (
                              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                                {(service.serviceCategory as any).name}
                              </span>
                            )}
                          <span className="text-xs text-gray-400">
                            Έναρξη: {new Date(service.startDate).toLocaleDateString('el-GR')}
                          </span>
                          {service.expirationDate && (
                            <span className="text-xs text-gray-400">
                              Λήξη:{' '}
                              {new Date(service.expirationDate as string).toLocaleDateString('el-GR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={status.className}>{status.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
