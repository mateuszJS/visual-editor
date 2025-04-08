import 'server-only'
import type { User } from '@/hooks/useUserStore'
import { createSessionCookie } from '@/app/api/session'
import { OAuth2Client } from 'google-auth-library'
import { NextResponse, type NextRequest } from 'next/server'
import { withCSRFProtection } from '@/app/api/csrf'

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
    const json = (await req.json()) as { idToken: string }
    const { idToken } = json

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'idToken is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Invalid token payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    /*
    {
      sub: '454365436345', // (Subject) Claim - Users google internal id
      email: 'jonh.smith@gmail.com',
      email_verified: true,
      name: 'John Smith',
      picture: 'https://......',
      given_name: 'John',
      family_name: 'Smith',
      exp: 1738431159,
    }
    */
    const user: User = {
      picture: payload.picture,
      firstName: payload.given_name,
      lastName: payload.family_name,
    }
    const response = NextResponse.json({ user }, { status: 200 })

    const sessionCookie = await createSessionCookie(payload.sub)
    response.cookies.set(sessionCookie)

    return response
  } catch (err: unknown) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const POST = withCSRFProtection(googleLogin)
