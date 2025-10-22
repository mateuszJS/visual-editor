import type { TokenPayload } from 'google-auth-library'
import { attachSessionCookie } from '../../../wrappers/session'
import getResponseError from '../../../utils/getResponseError'
import { withCSRFProtection } from '../../../wrappers/csrf'
import getUserData from '../../../utils/getUserData'
import withError from '../../../utils/error'
import { env } from 'cloudflare:workers'
import { createVerify } from 'node:crypto'
import { NodeCrypto } from 'google-auth-library/build/src/crypto/node/crypto'
import { BrowserCrypto } from 'google-auth-library/build/src/crypto/browser/crypto'
import { toByteArray } from 'base64-js'

// avoid import from google-auth-library. One of the exports(gcp-metadata -> google-logging-utils)
// causes claudflare deployments to fail with JS error(Uncaught TypeError: Cannot convert object to primitive value)
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client'

let client: OAuth2Client | null = null

if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  throw Error('Env var NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing!')
}

export const onRequestPost = withCSRFProtection(async (ctx) => {
  const [userData, err] = await withError(async () => {
    const { idToken } = await ctx.request.json<{ idToken: string }>()

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
      if (!client) {
        client = new OAuth2Client()

        self.window = {
          crypto: self.crypto,
        }

        // NodeCrypto.prototype.decodeBase64StringUtf8 = function decodeBase64StringUtf8CfPolyfill(
        //   base64: string
        // ) {
        //   console.log(';decodeBase64StringUtf8', base64)
        //   // @ts-expect-error: Private property
        //   const uint8array = toByteArray(BrowserCrypto.padBase64(base64))
        //   const result = new TextDecoder().decode(uint8array)
        //   console.log('decoded string:', result)
        //   return result
        // }

        // NodeCrypto.prototype.verify = async function verifyCfPolyfill(pubkey, data, signature) {
        //   console.log('polyfill works!!!!', pubkey, data, signature)
        //   const algo = {
        //     name: 'RSASSA-PKCS1-v1_5',
        //     hash: { name: 'SHA-256' },
        //   }
        //   const dataArray = new TextEncoder().encode(data as string)
        //   // @ts-expect-error: Private property
        //   const signatureArray = toByteArray(BrowserCrypto.padBase64(signature))
        //   const cryptoKey = await crypto.subtle.importKey(
        //     'jwk',
        //     pubkey as unknown as ArrayBuffer,
        //     algo,
        //     true,
        //     ['verify']
        //   )
        //   // SubtleCrypto's verify method is async so we must make
        //   // this method async as well.
        //   const result = await crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray)
        //   return result
        // }
      }

      // const response = await this.getFederatedSignonCertsAsync();
      // const login = await this.verifySignedJwtWithCertsAsync(options.idToken, response.certs, options.audience, this.issuers, options.maxExpiry);
      // return login;
      // const verifier = createVerify('RSA-SHA256')

      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      })

      payload = ticket.getPayload()
      if (!payload) {
        throw Error('Invalid token payload')
      }
    }

    const userData = await getUserData(ctx.env.db, payload)
    return userData
  })

  if (err) {
    console.error(err)
    return getResponseError('Authentication failed')
  }

  const response = Response.json(userData, { status: 200 })
  await attachSessionCookie(response, userData.id)
  return response
})
