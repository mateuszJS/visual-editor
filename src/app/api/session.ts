import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

if (!process.env.SESSION_SECRET) {
  throw new Error('env var SESSION_SECRET is missing!')
}

const secretKey = process.env.SESSION_SECRET // generated with: openssl rand -base64 32
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: string
  expiresAt: Date
}

const SESSION_LIFETIME_DAYS = 7

export async function createSessionCookie(userId: string): Promise<ResponseCookie> {
  const tokenLifetime = Date.now() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000
  const expiresAt = new Date(tokenLifetime)
  const session = await encrypt({ userId, expiresAt })

  return {
    name: 'session',
    value: session,
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'strict',
  }
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_LIFETIME_DAYS + 'd')
    .sign(encodedKey)
}

async function decrypt(session = '') {
  if (!session) return undefined

  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ['HS256'],
    })
    // check if token has expired!
    return payload as SessionPayload
  } catch (error: unknown) {
    if ((error as { code: string }).code !== 'ERR_JWT_EXPIRED') {
      console.error(error)
    }
  }
}

type RouteParams = Record<string, string | string[]>
type SessionHandler<Params> = (
  session: SessionPayload,
  req: NextRequest,
  params: { params: Promise<Params> }
) => Promise<Response>

export function withSession<Params extends RouteParams>(handler: SessionHandler<Params>) {
  return async (req: NextRequest, context: { params: Promise<Params> }) => {
    const sessionCookie = req.cookies.get('session')?.value
    const session = await decrypt(sessionCookie)

    if (!session?.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        statusText: 'Unauthorized',
      })
    }

    return handler(session, req, context)
  }
}
