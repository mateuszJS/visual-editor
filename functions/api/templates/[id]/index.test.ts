import { describe, it, expect } from 'vitest'
import { onRequestPost } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken, nonExistingUserSessionToken } from '@/setup'

describe('POST /api/templates/[id]', () => {
  it('returns error if user does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
    })
    const response = await onRequestPost(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
  })

  it('returns error if user is not the admin', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestPost(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
  })
})
