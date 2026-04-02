import type { AccessArgs } from 'payload'

export const isSuperAdmin = ({ req: { user } }: AccessArgs): boolean => {
  return (user as any)?.role === 'superadmin'
}
