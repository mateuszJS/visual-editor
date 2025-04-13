import 'server-only'
import { createSessionCookie } from '@/app/api/session'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { NextResponse, NextRequest, userAgent } from 'next/server'
import { withCSRFProtection } from '@/app/api/csrf'
import supabase from '@/app/api/supabaseClient'
import sanitizeUserData from '@/app/api/utils/sanitizeUserData'
import { geolocation } from '@vercel/functions'
import getResponseError from '@/app/api/utils/getResponseError'

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

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return getResponseError('Invalid token payload')
    }

    const userData = await getUserData(payload, req)
    const response = NextResponse.json({ user: sanitizeUserData(userData) }, { status: 200 })

    const sessionCookie = await createSessionCookie(userData.id.toString())
    response.cookies.set(sessionCookie)

    return response
  } catch (err: unknown) {
    console.error(err)
    return getResponseError('Authentication failed')
  }
}

export const POST = withCSRFProtection(googleLogin)
