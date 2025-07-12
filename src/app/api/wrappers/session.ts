import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import getResponseError from '../utils/getResponseError'

if (!process.env.SESSION_SECRET) {
  throw new Error('env var SESSION_SECRET is missing!')
}

const secretKey = process.env.SESSION_SECRET // generated with: openssl rand -base64 32
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: string
}

type RawSessionPayload = {
  userId: string
}

const SESSION_LIFETIME_DAYS = 7

export async function createSessionCookie(userId: string): Promise<ResponseCookie> {
  const tokenLifetime = Date.now() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000
  const expiresAt = new Date(tokenLifetime)
  const session = await encrypt({ userId })

  return {
    name: 'session',
    value: session,
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'strict',
  }
}

export async function encrypt(payload: RawSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_LIFETIME_DAYS + 'd')
    .sign(encodedKey)
}

async function decrypt(session = ''): Promise<SessionPayload | undefined | { error: string }> {
  if (!session) return undefined

  try {
    const { payload } = await jwtVerify<RawSessionPayload>(session, encodedKey, {
      algorithms: ['HS256'],
    })

    return {
      userId: payload.userId,
    }
  } catch (error: unknown) {
    const isSessionExpired = (error as { code: string }).code === 'ERR_JWT_EXPIRED'
    return {
      error: isSessionExpired
        ? 'Your session has expired. Please sign in again.'
        : 'Session is invalid. Please sign in again.',
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

    if (session && 'error' in session) {
      return getResponseError(session.error, 401)
    }

    if (!session?.userId) {
      return getResponseError('Unauthorized', 401)
    }

    return handler(session, req, context)
  }
}
