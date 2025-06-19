import type { Tables } from '@/app/api/supabaseClient/database.types'

export type SanitizedUser = Pick<Tables<'users'>, 'email' | 'name' | 'avatar' | 'projects'> & {
  id: string
}

export default function sanitizeUserData(data: Tables<'users'>): SanitizedUser {
  return {
    id: data.id.toString(),
    email: data.email,
    name: data.name,
    avatar: data.avatar,
    projects: data.projects,
  }
}
