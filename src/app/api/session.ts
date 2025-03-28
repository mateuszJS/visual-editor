import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const secretKey = process.env.AUTH_SECRET // generated with: openssl rand -base64 32
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: string
  expiresAt: Date
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })

  const requestCookies = await cookies()
  requestCookies.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  })
}

export async function deleteSession() {
  const requestCookie = await cookies()
  requestCookie.delete('session')
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

async function decrypt(session = '') {
  if (!session) return undefined

  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as SessionPayload
  } catch (error) {
    console.error(error)
  }
}

type RouteParams = Record<string, string | string[]>
type AuthHandler<Params> = (
  session: SessionPayload,
  req: NextRequest,
  params: Promise<Params>
) => Promise<Response>

export function withAuth<Params extends RouteParams>(handler: AuthHandler<Params>) {
  return async (req: NextRequest, context: { params: Promise<Params> }) => {
    const requestCookies = await cookies()
    const sessionCookie = requestCookies.get('session')?.value
    const session = await decrypt(sessionCookie)

    if (!session?.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        statusText: 'Unauthorized',
      })
    }

    return handler(session, req, context.params)
  }
}
