import { describe, it, expect, vi } from 'vitest'
import { onRequestGet } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken } from '@/setup'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

describe('GET /api/project-uploads/[projectId]/[uploadId]', () => {
  it('redirects if everything is correct (project exists, user is the owner, signed url generated with no errors)', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { projectId: '1', uploadId: '1' }))

    expect(response.status).toBe(307)
    expect(response.headers.get('Location')).toBe(
      'https://storage-provider.com/signed-url?bucket=user-uploads&key=1/1&expiredsIn=604800'
    )
  })

  it('returns error if there is no project with passed id', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { projectId: '-1', uploadId: '1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if the user is not the owner of the project', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { projectId: '3', uploadId: '1' }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })

  it('returns error if there is an error from the s3 presigner', async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 is down'))

    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { projectId: '1', uploadId: '1' }))

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestGet(
      getContext(new Request('x:'), { projectId: '1', uploadId: '1' })
    )

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })
})
