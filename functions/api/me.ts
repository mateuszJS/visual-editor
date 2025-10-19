import { getAuthErrorResponse, removeSessionCookie, withSession } from '../wrappers/session'
import { UserDB } from '../types/user'

export const onRequestGet = withSession(async (ctx, session) => {
  try {
    const user = await ctx.env.db
      .prepare('SELECT id, email, name, photo FROM users WHERE id = ?')
      .bind(session.userId)
      .first<Pick<UserDB, 'id' | 'email' | 'name' | 'photo'>>()

    if (user) {
      return Response.json(
        {
          ...user,
          id: user.id.toString(),
        },
        { status: 200 }
      )
    }
  } catch (err: unknown) {}

  const response = getAuthErrorResponse()
  removeSessionCookie(response)
  return response
})
