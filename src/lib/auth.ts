import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import config from '@/payload.config'

export type UserRole = 'superadmin' | 'admin' | 'client'

export interface AuthUser {
  id: string | number
  email: string
  name?: string
  role: UserRole
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!user) return null
  return user as unknown as AuthUser
}

export async function requireAuth(redirectTo = '/login'): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user) redirect(redirectTo)
  return user
}

export async function requireRole(
  role: UserRole,
  redirectTo = '/login',
): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user || user.role !== role) redirect(redirectTo)
  return user
}

export async function requireAdminOrSuperAdmin(): Promise<AuthUser> {
  const user = await getAuthUser()
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    redirect('/login')
  }
  return user
}
