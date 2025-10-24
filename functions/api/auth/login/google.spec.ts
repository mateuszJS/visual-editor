import { resolve } from 'node:path'
import { fetch } from 'undici'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { runWranglerPagesDev } from '../../shared/src/run-wrangler-long-lived'

// https://github.com/cloudflare/workers-sdk/blob/main/fixtures/pages-functions-app/tests/index.test.ts

describe('Pages Functions', () => {
  let ip: string, port: number, stop: (() => Promise<unknown>) | undefined, getOutput: () => string

  beforeAll(async () => {
    ;({ ip, port, stop, getOutput } = await runWranglerPagesDev(
      resolve(__dirname, '..'),
      'public',
      [
        '--binding=NAME=VALUE',
        '--binding=OTHER_NAME=THING=WITH=EQUALS',
        '--r2=bucket',
        '--port=0',
        '--inspector-port=0',
      ]
    ))
  })

  afterAll(async () => {
    await stop?.()
  })

  it('renders static pages', async ({ expect }) => {
    const response = await fetch(`http://${ip}:${port}/`)
    expect(response.headers.get('x-custom')).toBe('header value')
    const text = await response.text()
    expect(text).toContain('Hello, world!')
  })
})
