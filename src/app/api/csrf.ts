import 'server-only'
import { NextRequest } from 'next/server'

export function withCSRFProtection(handler: (req: NextRequest) => void) {
  return async (req: NextRequest) => {
    const csrfTokenFromCookie = req.cookies.get('csrf-token')?.value
    const csrfTokenFromHeader = req.headers.get('x-csrf-token')

    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(req)
  }
}
