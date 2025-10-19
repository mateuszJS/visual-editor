export type UserDB = {
  id: number
  name: string | null
  photo: string | null
  email: string
  created_at: string
  language: string | null
  country: string | null
  browser: string | null
  device_type: string | null
  device_model: string | null
  browser_engine: string | null
  os: string | null
  is_bot: 0 | 1
  login_method: string
  oidc_google_id: string | null
  last_login: string
}

export type UserBasicInfo = {
  id: string
  email: string
  name: string | null
  photo: string | null
}

export function sanitizeBasicInfo(
  data: Pick<UserDB, 'id' | 'email' | 'name' | 'photo'>
): UserBasicInfo {
  return {
    id: data.id.toString(),
    email: data.email,
    name: data.name,
    photo: data.photo,
  }
}
