import { TokenPayload } from 'google-auth-library'
// import { geolocation } from '@vercel/functions'
import * as User from '../types/user'

// This function can throw!
export default async function getUserData(
  db: D1Database,
  payload: TokenPayload
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

  if (!payload.email) {
    // this case at least for google should never happen
    throw Error('Email to sign in was not provided.')
  }

  const { meta } = await db
    .prepare(
      `INSERT INTO users (email, name, photo, is_bot, login_method, oidc_google_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(payload.email, payload.given_name, payload.picture, false, 'google', payload.sub)
    .run()

  const createdUser = await db
    .prepare('SELECT id, email, name, photo FROM users WHERE id = ?')
    .bind(meta.last_row_id)
    .first<Pick<User.DB, 'id' | 'email' | 'name' | 'photo'>>()

  return User.sanitizeBasicInfo(createdUser)
}
