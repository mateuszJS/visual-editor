import { getAuthErrorResponse, removeSessionCookie, withSession } from '../../wrappers/session'
import * as User from '../../types/user'
import withError from '@/utils/error'

export const onRequestGet = withSession(async (ctx, session) => {
  const [user, err] = await withError(async () => {
    const user = await ctx.env.db
      .prepare('SELECT id, email, name, photo FROM users WHERE id = ?')
      .bind(session.userId)
      .first<Pick<User.DB, 'id' | 'email' | 'name' | 'photo'>>()
    return User.sanitizeBasic(user)
  })

  if (err) {
    const response = getAuthErrorResponse()
    removeSessionCookie(response)
    return response
  }

  return Response.json(user, { status: 200 })
})
