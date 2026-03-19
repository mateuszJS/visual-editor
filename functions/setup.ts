import '@total-typescript/ts-reset'
import { beforeAll, beforeEach, vi } from 'vitest'
import { TokenPayload } from 'google-auth-library'
import { applyD1Migrations } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// Most helpful docs so far:
// https://github.com/cloudflare/workers-sdk/pull/11632/changes
// https://blog.cloudflare.com/workers-vitest-integration/

beforeAll(async () => {
  await applyD1Migrations(env.db, env.TEST_MIGRATIONS)

  vi.useFakeTimers()
  const date = Date.UTC(2000, 0)
  vi.setSystemTime(date)

  vi.mock('google-auth-library/build/src/auth/oauth2client', () => {
    return {
      OAuth2Client: vi.fn(function () {
        return {
          verifyIdToken: vi.fn(function ({ idToken }: { idToken: string }) {
            return {
              getPayload: vi.fn(function () {
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
            }
          }),
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
})

beforeEach(async () => {
  await env.db.prepare('DELETE FROM projects').run()
  await env.db.prepare('DELETE FROM users').run()
  // await env.userUploads.list().then(({ objects }) => {
  //   return Promise.all(
  //     objects.map((obj) => {
  //       return env.userUploads.delete(obj.key)
  //     })
  //   )
  // })

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
    .bind(aliceProjectId, 100, 200, '[]', '2')
    .run()

  // put an object with updated-at metadata
  await env.userUploads.put('1/miniature', new Uint8Array([1, 2, 3]), {
    customMetadata: {
      'updated-at': '2025-01-01T00:00:00.000Z',
    },
  })

  // object representing just a user's upload
  await env.userUploads.put('1/upload-id', new Uint8Array([1, 2, 3]))
})

// to receive those session value just call await encrypt({ userId: '23891542398' }) in session.ts

// id 2
export const aliceSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyIiwiaWF0Ijo5NDY2ODQ4MDAsImV4cCI6OTQ3Mjg5NjAwfQ.NyxfB3Mgm8pV0RzapXAef0ykdsMSsZ_BlHjEv7B6Erw'

// id 3
export const bobSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzIiwiaWF0Ijo5NDY2ODQ4MDAsImV4cCI6OTQ3Mjg5NjAwfQ.twc4OheHNODBz0ayq5CX46uXjHBEssPK7YyYdmgENG8'

// id 4
export const nextUserSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0IiwiaWF0Ijo5NDY2ODQ4MDAsImV4cCI6OTQ3Mjg5NjAwfQ.UlYpmMlXP1pw6Fc9BQZBPe8C2-yoENkAmJMl3m0I_jE'

// id 23891542398
export const nonExistingUserSessionToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMzg5MTU0MjM5OCIsImlhdCI6OTQ2Njg0ODAwLCJleHAiOjk0NzI4OTYwMH0.dmW-Hmr6dBD8kEuAr3zuAM5iCYRodZ_NpSVZSkDVJnc'

export const aliceProjectId = '1'
