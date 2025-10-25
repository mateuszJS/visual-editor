import { describe, it, expect } from 'vitest'
import { onRequestGet } from '.'
import { aliceSessionToken, nonExistingUserSessionToken } from '@/setup'
import getContext from '@/test/getContext'

describe('GET /me', () => {
  it('returns user if exists in DB', async () => {
    const request = new Request('x:', {
      method: 'GET',
      headers: {
        Cookie: `session=${aliceSessionToken}`,
      },
    })

    const response = await onRequestGet(getContext(request))

    expect(await response.json()).toEqual({
      id: '2',
      email: 'alice@example.com',
      name: 'Alice',
      photo: 'https://example.com/alice.png',
    })
    expect(response.status).toBe(200)
  })

  it('returns 401 if session cookie is invalid', async () => {
    const request = new Request('x:', {
      method: 'GET',
      headers: {
        Cookie: 'session=invalid-token',
      },
    })

    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
  })

  it('returns 401 if session cookie is not present', async () => {
    const request = new Request('x:', {
      method: 'GET',
      headers: {},
    })

    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
  })

  it('returns 401 if user does not exist', async () => {
    const request = new Request('x:', {
      method: 'GET',
      headers: {
        Cookie: `session=${nonExistingUserSessionToken}`,
      },
    })

    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
  })
})
