import { describe, it, expect, vi } from 'vitest'
import { onRequestGet } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken, bobSessionToken } from '@/setup'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

describe('GET /api/storage/[id]/preview', () => {
  it('redirects if storage item exists, user is the owner, signed url generated with no errors', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: 'si_1' }))

    expect(response.status).toBe(307)
    expect(response.headers.get('Location')).toBe(
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=s3_preview_1&expiredsIn=604800'
    )
  })

  it('returns error if there is no storage item with passed id', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: 'si_0' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if the user is not the owner of the project', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${bobSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: 'si_1' }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })

  it('returns error if there is an error from the s3 presigner', async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 utility has failed'))

    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: 'si_1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestGet(getContext(new Request('x:'), { id: 'si_1' }))

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })
})
