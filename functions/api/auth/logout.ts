import { removeSessionCookie, withSession } from '../../wrappers/session'

export const onRequestDelete = withSession(() => {
  const response = new Response(null, { status: 204 })
  removeSessionCookie(response)
  return response
})
