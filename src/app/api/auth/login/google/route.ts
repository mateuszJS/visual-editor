import 'server-only'
import { createSessionCookie } from '@/app/api/session'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { NextResponse, NextRequest, userAgent } from 'next/server'
import { withCSRFProtection } from '@/app/api/csrf'
import supabase from '@/utils/supabaseClient'
import sanitizeUserData from '@/app/api/utils/sanitizeUserData'
import { geolocation } from '@vercel/functions'
import getResponseError from '@/app/api/utils/getResponseError'

if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw Error('env var NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing!')
}

const client = new OAuth2Client()

async function getUserData(payload: TokenPayload, req: NextRequest) {
  const existingUser = await supabase.from('users').select().eq('oidc_google_id', payload.sub)

  if (existingUser.error) {
    throw new Error(existingUser.error.message)
  }

  if (existingUser.data[0]) {
    return existingUser.data[0]
  }

  const language = req.headers.get('accept-language')?.split(',')[0]
  const { isBot, browser, device, engine, os } = userAgent(req)

  if (!payload.email) {
    throw Error('Email to sign in was not provided.')
  }

  const createUser = await supabase
    .from('users')
    .insert({
      email: payload.email,
      name: payload.given_name,
      avatar: payload.picture,
      language,
      country: geolocation(req).country,
      browser: browser.name,
      device_type: device.type,
      device_model: device.model,
      browser_engine: engine.name,
      os: os.name,
      is_bot: isBot,
      login_method: 'google',
      oidc_google_id: payload.sub,
    })
    .select()
    .single()

  if (!createUser.data || createUser.error) {
    throw new Error(createUser.error.message || 'Failed to create user')
  }

  return createUser.data
}

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
