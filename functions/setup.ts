import { beforeAll, vi } from 'vitest'
import { TokenPayload } from 'google-auth-library'
import { applyD1Migrations, env } from 'cloudflare:test'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// works only with "@cloudflare/vitest-pool-workers": "^0.8.49",
// newer version has bug when setup file runs again
// https://github.com/cloudflare/workers-sdk/issues/10506
await applyD1Migrations(env.db, env.TEST_MIGRATIONS)

beforeAll(async () => {
  vi.useFakeTimers()
  const date = new Date(2000, 0)
  vi.setSystemTime(date)

  vi.mock('google-auth-library/build/src/auth/oauth2client', () => {
    return {
      OAuth2Client: vi.fn().mockImplementation(() => {
        return {
          verifyIdToken: vi.fn().mockImplementation(({ idToken }: { idToken: string }) => ({
            getPayload: vi.fn().mockImplementation(() => {
              if (idToken === 'new-token') {
                return {
                  email: 'test@example.com',
                  given_name: 'John Doe',
                  picture: 'https://example.com/avatar.png',
                  iss: 'https://accounts.google.com',
                  sub: '2660163898',
                  aud: '',
                  iat: 1704067200,
                  exp: 4859740800,
                } satisfies TokenPayload
              } else if (idToken === 'existing-token') {
                return {
                  email: 'alicewe@example.com',
                  given_name: 'Alice',
                  picture: 'https://example.com/alice.png',
                  iss: 'https://accounts.google.com',
                  sub: '1', // Alice mock user,
                  aud: '',
                  iat: 1704067200,
                  exp: 4859740800,
                } satisfies TokenPayload
              } else if (idToken === 'error-token') {
                throw new Error('Invalid ID token')
              } else if (idToken === 'invalid-token') {
                return undefined
              }

              throw Error('Unhandled token type: ' + idToken)
            }),
          })),
        }
      }),
    }
  })

  vi.mock('@aws-sdk/s3-request-presigner', () => {
    return {
      getSignedUrl: vi
        .fn()
        .mockImplementation(
          (
            s3Client,
            command: GetObjectCommand | PutObjectCommand,
            options: { expiresIn: number }
          ) => {
            if (command instanceof PutObjectCommand) {
              return `https://storage-provider.com/signed-url?bucket=${command.input.Bucket}&key=${command.input.Key}&expiredsIn=${options.expiresIn}&contentLength=${command.input.ContentLength}`
            }

            // this is not REAL signed url, we just use it to verify if all the information was passed correctly to signed url generator
            return `https://storage-provider.com/signed-url?bucket=${command.input.Bucket}&key=${command.input.Key}&expiredsIn=${options.expiresIn}`
          }
        ),
    }
  })

  vi.mock('uuid', async () => {
    return {
      v4: () => 'uuid-generated-id',
    }
  })

  vi.mock('node:crypto', () => {
    return {
      randomBytes: () => ({
        toString: () => 'node-crypto-random-bytes',
      }),
    }
  })

  // prettier-ignore
  await env.db
    .prepare(
      `INSERT INTO users (id, email, name, photo, login_method, oidc_google_id)
			 VALUES
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      '2', 'alice@example.com', 'Alice', 'https://example.com/alice.png', 'google', '1', // alice
      '3', 'bob@example.com', 'Alice', 'https://example.com/bob.png', 'google', '2' // bob
    )
    .run()

  await env.db
    .prepare(
      `INSERT INTO projects (id, width, height, assets, owner_id)
			 VALUES (?, ?, ?, ?, ?)`
    )
    .bind(1, 100, 200, '[]', '2')
    .run()
})

export const aliceSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyIiwiaWF0Ijo5NDY2ODEyMDAsImV4cCI6OTQ3Mjg2MDAwfQ.jYtsRJtRljicKqM00YLA30ApNiHtag-8WwiafCLCM3k'

export const bobSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzIiwiaWF0Ijo5NDY2ODEyMDAsImV4cCI6OTQ3Mjg2MDAwfQ.Wg2bKvri4wlVeXCsoA7s4Uyhgsu8OSMAHhxhpHvaxEI'

export const nextUserSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0IiwiaWF0Ijo5NDY2ODEyMDAsImV4cCI6OTQ3Mjg2MDAwfQ.jrKc7gSObohaPXbWC3EC-nnS3FcTrWRIFMDiX9jeInA'

// id 23891542398
export const nonExistingUserSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMzg5MTU0MjM5OCIsImlhdCI6OTQ2NjgxMjAwLCJleHAiOjk0NzI4NjAwMH0.qp4yXwD9K1CqhD2QagBLidzO0yiaEPP2mWjCaOlg0qA'
