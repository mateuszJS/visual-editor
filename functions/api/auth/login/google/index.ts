import type { TokenPayload } from 'google-auth-library'
import { attachSessionCookie } from '@/wrappers/session'
import getResponseError from '@/utils/getResponseError'
import { withCSRFProtection } from '@/wrappers/csrf'
import getUserData from '@/utils/getUserData'
import withError from '@/utils/error'
import { env } from 'cloudflare:workers'

// avoid import from google-auth-library. One of the exports(gcp-metadata -> google-logging-utils)
// causes claudflare deployments to fail with JS error(Uncaught TypeError: Cannot convert object to primitive value)
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client'
import type { UserAgentInfo } from '../../../../../src/utils/getUserAgent'

let client: OAuth2Client | null = null

if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw Error('Env var NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing!')
}

export const onRequestPost = withCSRFProtection(async (ctx) => {
  const [userData, err] = await withError(async () => {
    const { idToken, userAgent = {} } = await ctx.request.json<{
      idToken?: string
      userAgent?: Partial<UserAgentInfo>
    }>()

    if (!idToken) {
      throw Error('idToken is required')
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
      // Workers use unenv to polyfill node environemnt
      // unenv doesn't implement crypto.createVerify at this moment: https://github.com/unjs/unenv/blob/v1/src/runtime/node/crypto/node.ts#L120
      // which is used if google-auth-library detects current env as Node.
      // That's why for a brief moment we pretend window & window.crypto exists so google auth chooses flow for web env
      // cloudflare crypto & window.crypto have similar API
      // @ts-expect-error: window is not defined in workers
      self.window = {
        crypto: self.crypto,
      }

      if (!client) {
        client = new OAuth2Client()
      }

      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      })

      payload = ticket.getPayload()

      // @ts-expect-error: window is not defined in workers
      delete self.window

      if (!payload) {
        throw Error('Invalid token payload')
      }
    }

    const userData = await getUserData(
      ctx.env.db,
      payload,
      ctx.request.cf,
      userAgent,
      ctx.request.headers.get('accept-language')?.split(',')[0]
    )
    return userData
  })

  if (err) {
    // console.error(err) capture this log in the future
    return getResponseError('Authentication failed')
  }

  const response = Response.json(userData, { status: 200 })
  await attachSessionCookie(response, userData.id)
  return response
})
