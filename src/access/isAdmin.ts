import type { AccessArgs } from 'payload'

export const isAdmin = ({ req: { user } }: AccessArgs): boolean => {
  return (user as any)?.role === 'admin'
}
