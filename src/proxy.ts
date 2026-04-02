import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Decodes the Payload JWT payload without verifying the signature.
 * Signature verification happens inside Payload — middleware only needs the role claim
 * to decide whether to redirect. The actual Payload API still enforces real auth.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = Buffer.from(parts[1], 'base64url').toString('utf-8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect Payload admin panel — only superadmin allowed
  // If NO token exists, let Payload handle its own auth flow (login / create-first-user)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('payload-token')?.value

    if (token) {
      // Token present — enforce superadmin role
      const decoded = decodeJwtPayload(token)
      if (!decoded || decoded.role !== 'superadmin') {
        const role = decoded?.role
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        if (role === 'client') {
          return NextResponse.redirect(new URL('/portal', request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
    // No token — fall through and let Payload's own login/create-first-user render
  }

  // Protect /dashboard — only admin or superadmin
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const decoded = decodeJwtPayload(token)
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'superadmin')) {
      if (decoded?.role === 'client') {
        return NextResponse.redirect(new URL('/portal', request.url))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect /portal — only client
  if (pathname.startsWith('/portal')) {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const decoded = decodeJwtPayload(token)
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (decoded.role !== 'client') {
      if (decoded.role === 'superadmin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (decoded.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/portal/:path*'],
}
