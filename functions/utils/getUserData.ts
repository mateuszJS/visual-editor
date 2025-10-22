import { TokenPayload } from 'google-auth-library'
// import { geolocation } from '@vercel/functions'
import * as User from '../types/user'
import { UserAgentInfo } from '../../src/utils/getUserAgent'

// This function can throw!
export default async function getUserData(
  db: D1Database,
  payload: TokenPayload,
  cf: Request['cf'] = {},
  userAgent: UserAgentInfo,
  language?: string
): Promise<User.BasicInfo> {
  const existingUser = await db
    .prepare('SELECT id, email, name, photo FROM users WHERE oidc_google_id = ?')
    .bind(payload.sub)
    .first<Pick<User.DB, 'id' | 'email' | 'name' | 'photo'>>()

  if (existingUser) {
    return User.sanitizeBasicInfo(existingUser)
  }

  // const language = req.headers.get('accept-language')?.split(',')[0]
  // const { isBot, browser, device, engine, os } = userAgent(req)

  const { meta } = await db
    .prepare(
      `INSERT INTO users (email, name, photo, login_method, oidc_google_id, country, region, browser, device_model, device_type, device_vendor, os, os_version, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      payload.email,
      payload.given_name,
      payload.picture,
      'google',
      payload.sub,
      cf.country || null,
      cf.region || null,
      userAgent.browser || null,
      userAgent.deviceModel || null,
      userAgent.deviceType || null,
      userAgent.deviceVendor || null,
      userAgent.os || null,
      userAgent.osVersion || null,
      language || null
    )
    .run()

  const createdUser = await db
    .prepare('SELECT id, email, name, photo FROM users WHERE id = ?')
    .bind(meta.last_row_id)
    .first<Pick<User.DB, 'id' | 'email' | 'name' | 'photo'>>()

  return User.sanitizeBasicInfo(createdUser)
}
