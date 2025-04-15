import type { Tables } from '@/app/api/supabaseClient/database.types'

export type SanitizedUser = Pick<Tables<'users'>, 'id' | 'email' | 'name' | 'avatar' | 'projects'>

export default function sanitizeUserData(data: Tables<'users'>): SanitizedUser {
  return data
  // return {
  //   id: data.id,
  //   email: data.email,
  //   name: data.name,
  //   avatar: data.avatar,
  //   projects: data.projects,
  // }
}
