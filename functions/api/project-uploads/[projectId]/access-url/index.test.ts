import { describe, it, expect, vi } from 'vitest'
import { onRequestPost } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken } from '@/setup'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

describe('POST /api/project-uploads/[projectId]/access-url', () => {
  it('returns url & uploadId if signed url was created successfully', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ contentLength: 1024 }),
    })
    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual({
      uploadId: 'uuid-generated-id',
      url: 'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/uuid-generated-id&expiredsIn=600&contentLength=1024',
    })
  })

  it('returns error if user is not the owner of the project', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ contentLength: 1024 }),
    })
    const response = await onRequestPost(getContext(request, { projectId: '-1' }))

    const json = await response.json()

    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if there is an error thrown in s3 lib', async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 is down'))
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ contentLength: 1024 }),
    })
    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is not present', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
    })
    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is below or equal to 0', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ contentLength: 0 }),
    })
    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is above 3MB', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ contentLength: 3 * 1024 * 1024 + 1 }),
    })
    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestPost(getContext(new Request('x:'), { projectId: '1' }))

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  it('returns error if json is invalid', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: 'invalid json',
    })

    const response = await onRequestPost(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })
})
