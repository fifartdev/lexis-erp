import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export default async function CategoriesPage() {
  const payload = await getPayload({ config })
  const { docs: categories } = await payload.find({
    collection: 'service-categories',
    limit: 200,
    overrideAccess: true,
    sort: 'name',
  })

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Κατηγορίες Υπηρεσιών</h2>
          <p className="text-gray-500 text-sm mt-1">{categories.length} κατηγορίες</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Νέα Κατηγορία
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <p className="font-medium">Δεν υπάρχουν κατηγορίες ακόμα</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                <Link
                  href={`/dashboard/categories/${cat.id}/edit`}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                  Επεξεργασία
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
