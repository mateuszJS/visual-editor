import { SignJWT, jwtVerify } from 'jose'
import getResponseError from '../utils/getResponseError'
import { parse } from 'cookie'
import { env } from 'cloudflare:workers'

if (!env.SESSION_SECRET) {
  // generated with: openssl rand -base64 32
  throw new Error('SESSION_SECRET is not defined in environment variables.')
}

const encodedKey = new TextEncoder().encode(env.SESSION_SECRET)

type RawSessionPayload = {
  userId: string
}

const SESSION_LIFETIME_DAYS = 7

function getCookie(value: string, expiresAt: Date): string {
  return `session=${value}; HttpOnly; Secure; SameSite=Strict; Expires=${expiresAt.toUTCString()}; Path=/api/`
}

export async function attachSessionCookie(res: Response, userId: string): Promise<void> {
  const tokenLifetime = Date.now() + SESSION_LIFETIME_DAYS * 24 * 60 * 60 * 1000
  const expiresAt = new Date(tokenLifetime)
  const session = await encrypt({ userId })
  res.headers.append('Set-Cookie', getCookie(session, expiresAt))
}

export function removeSessionCookie(res: Response): void {
  res.headers.append('Set-Cookie', getCookie('', new Date(0)))
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

// same response to avoid sharing any detail of what exactly went wrong while authorization/obtaining user object
export const getAuthErrorResponse = () => getResponseError('Unauthorized', 401)

async function get404Response(env: EventContext<Env, never, unknown>['env']) {
  const response = await env.ASSETS.fetch(new URL('http://any-valid-hostname/404.html'))
  return new Response(response.body, {
    status: 404,
    headers: response.headers,
  })
}

type Options = {
  adminOnly?: boolean
}

export function withSession<Params extends string = never, Data = never>(
  handler: SessionHandler<Params, Data>,
  options?: Options
): Handler<Params, Data> {
  return async (ctx) => {
    const cookie = parse(ctx.request.headers.get('Cookie') || '')

    if (!cookie.session) {
      if (options?.adminOnly) {
        return get404Response(ctx.env)
      }
      return getAuthErrorResponse()
    }
    const session = await decrypt(cookie.session)

    if (session && 'error' in session) {
      // console.error(session.error) capture this log in the future
    }

    if (!session || 'error' in session || !session?.userId) {
      if (options?.adminOnly) {
        return get404Response(ctx.env)
      }

      const res = getAuthErrorResponse()
      removeSessionCookie(res)
      return res
    }

    if (options?.adminOnly) {
      if (session.userId !== ctx.env.ADMIN_USER_ID) {
        return get404Response(ctx.env)
      }
    }

    return handler(ctx, session)
  }
}
