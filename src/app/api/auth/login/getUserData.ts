import { TokenPayload } from 'google-auth-library'
import { NextRequest, userAgent } from 'next/server'
import supabase from '@/app/api/supabaseClient'
import { geolocation } from '@vercel/functions'

export default async function getUserData(payload: TokenPayload, req: NextRequest) {
  const existingUser = await supabase.from('users').select().eq('oidc_google_id', payload.sub)

  if (existingUser.error) {
    throw new Error('SUPABASE ERROR: ' + existingUser.error.message)
  }

  if (existingUser.data[0]) {
    return existingUser.data[0]
  }

  const language = req.headers.get('accept-language')?.split(',')[0]
  const { isBot, browser, device, engine, os } = userAgent(req)

  if (!payload.email) {
    // this case at least for google should never happen
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

  if (createUser.error) {
    throw new Error('SUPABASE ERROR: ' + createUser.error.message)
  }

  if (!createUser.data) {
    throw new Error('Failed to create user.')
  }

  return createUser.data
}
