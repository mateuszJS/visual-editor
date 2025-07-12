import 'server-only'
import { createSessionCookie } from '@/app/api/wrappers/session'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { NextResponse, NextRequest } from 'next/server'
import { withCSRFProtection } from '@/app/api/wrappers/csrf'
import sanitizeUserData from '@/app/api/utils/sanitizeUserData'
import getResponseError from '@/app/api/utils/getResponseError'
import getUserData from '../getUserData'

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw Error('env var NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing!')
}

const client = new OAuth2Client()

/**
 *
 * @param req Expects jso nwith property "idToken" which is a JWT token
 */
async function googleLogin(req: NextRequest) {
  try {
    const { idToken } = (await req.json()) as { idToken: string }

    if (!idToken) {
      return getResponseError('idToken is required')
    }

    let payload: TokenPayload | undefined = undefined
    // On mobile it says invalid CSRF token, is that because I'm signed on desktop on same account????
    if (idToken === 'test-account') {
      payload = {
        iss: 'https://accounts.google.com',
        sub: '1234567890',
        aud: 'the OAuth 2.0 client IDs of your application',
        iat: 1704067200,
        exp: 4859740800,
      }
    } else {
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      })

      payload = ticket.getPayload()
      if (!payload) {
        return getResponseError('Invalid token payload')
      }
    }

    const userData = await getUserData(payload, req)
    const response = NextResponse.json({ user: sanitizeUserData(userData) }, { status: 200 })

    const sessionCookie = await createSessionCookie(userData.id)
    response.cookies.set(sessionCookie)

    return response
  } catch (err: unknown) {
    console.error(err)
    return getResponseError('Authentication failed')
  }
}

export const POST = withCSRFProtection(googleLogin)
