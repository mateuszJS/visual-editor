import { describe, it, expect } from 'vitest'
import { onRequestDelete } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken } from '@/setup'

describe('DELETE /auth/logout', () => {
  it('removes session cookie if user session cookie exists', async () => {
    const request = new Request('x:', {
      method: 'DELETE',
      headers: {
        Cookie: `session=${aliceSessionToken}`,
      },
    })

    const response = await onRequestDelete(getContext(request))

    expect(response.status).toBe(204)
    expect(response.headers.get('Set-Cookie')).toBe(
      'session=; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/api/'
    )
  })

  it('returns 401 if no session cookie is present', async () => {
    const request = new Request('x:', {
      method: 'DELETE',
      headers: {},
    })

    const response = await onRequestDelete(getContext(request))

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
  })
})
