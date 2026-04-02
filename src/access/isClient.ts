import type { AccessArgs } from 'payload'

export const isClient = ({ req: { user } }: AccessArgs): boolean => {
  return (user as any)?.role === 'client'
}
