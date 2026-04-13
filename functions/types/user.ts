import { ApiUserBasic } from '../../apiTypes'

export type DB = {
  id: string
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
  login_method: string
  oidc_google_id: string | null
  last_login_at: string
  region: string | null
  device_vendor: string | null
  os_version: string | null
}

export function sanitizeBasic(
  data: Pick<DB, 'id' | 'email' | 'name' | 'photo'> | null
): ApiUserBasic {
  if (!data) {
    throw new Error('No data was found.')
  }

  return {
    id: data.id,
    email: data.email,
    name: data.name,
    photo: data.photo,
  }
}
