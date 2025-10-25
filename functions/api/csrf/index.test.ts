import { describe, it, expect, vi } from 'vitest'
import { onRequestGet } from '.'
import getContext from '@/test/getContext'

describe('GET /csrf', () => {
  it('responds with set cookie and csrf token in the response body', async () => {
    vi.mock('node:crypto', () => {
      return {
        randomBytes: () => ({
          toString: () => 'a',
        }),
      }
    })
    const request = new Request('x:', {
      method: 'GET',
    })

    const response = await onRequestGet(getContext(request))
    expect(response.status).toBe(200)
    expect(response.headers.get('Set-Cookie')).toBe(
      'csrf-token=a; Path=/api/auth/login; HttpOnly; Secure; SameSite=Strict'
    )
    expect(await response.json()).toEqual({ csrfToken: 'a' })
  })
})
