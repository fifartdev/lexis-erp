interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red'
  sub?: string
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
}

export function StatCard({ label, value, icon, color = 'blue', sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
      </div>
    </div>
  )
}
