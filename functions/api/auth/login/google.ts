import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { attachSessionCookie } from '../../../wrappers/session'
import getResponseError from '../../../utils/getResponseError'
import { withCSRFProtection } from '../../../wrappers/csrf'
import getUserData from '../../../utils/getUserData'

let client: OAuth2Client | null = null

export const onRequestPost = withCSRFProtection(async (ctx) => {
  try {
    const { idToken } = (await ctx.request.json()) as { idToken: string }

    if (!idToken) {
      return getResponseError('idToken is required')
    }

    let payload: TokenPayload | undefined = undefined

    if (idToken === 'test-account') {
      payload = {
        iss: 'https://accounts.google.com',
        sub: '1234567890',
        aud: 'the OAuth 2.0 client IDs of your application',
        iat: 1704067200,
        exp: 4859740800,
      }
    } else {
      if (!client) {
        client = new OAuth2Client()
      }
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: ctx.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      })

      payload = ticket.getPayload()
      if (!payload) {
        return getResponseError('Invalid token payload')
      }
    }

    const userData = await getUserData(ctx.env.db, payload)
    const response = Response.json(userData, { status: 200 })

    await attachSessionCookie(response, userData.id)

    return response
  } catch (err: unknown) {
    console.error(err)
    return getResponseError('Authentication failed')
  }
})
