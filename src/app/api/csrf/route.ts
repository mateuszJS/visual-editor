import 'server-only'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Currently we only use CSRF for vulnerable endpoints which does not require user's session cookie
// like login. The benefits of that is when user open the mobile app,
// we can faster fetch user data, instead of waiting for CSRF token to be download firstly

export async function GET() {
  const csrfToken = crypto.randomBytes(32).toString('hex')

  const response = NextResponse.json({ csrfToken })
  response.cookies.set('csrf-token', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/login',
  })

  return response
}
