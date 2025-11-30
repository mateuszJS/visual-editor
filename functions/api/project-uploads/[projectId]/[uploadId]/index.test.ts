import { describe, it, expect, vi } from 'vitest'
import { onRequestGet, onRequestPut } from '.'
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
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/1&expiredsIn=604800'
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
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 utility has failed'))

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

const file = new File(['image-data'], 'image-blob.png', { type: 'image/png' })

describe('PUT /api/project-uploads/[projectId]/[uploadId]', () => {
  it('if everything is correct redirects to cloud provider url', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(307)
    const locationHeader = response.headers.get('Location')
    expect(locationHeader).toEqual(
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/upload-id&expiredsIn=300&contentLength=1024'
    )
  })

  it('returns error if user is not the owner of the project', async () => {
    const request = new Request('x:?contentLength=1024', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '-1', uploadId: 'upload-id' })
    )

    const json = await response.json()

    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if there is an error thrown in S3 lib', async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 utility has failed'))
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is not present', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is below or equal to 0', async () => {
    const request = new Request('x:?contentLength=0', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if contentLength is above 3MB', async () => {
    const request = new Request(`x:?contentLength=${3 * 1024 * 1024 + 1}`, {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestPut(
      getContext(new Request('x:'), { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  it('redirects if request header x-amz-meta-updated-at is provided but R2 object does not have updated-at as custom metadata', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-amz-meta-updated-at': '2020-01-01T00:00:00.000Z',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'upload-id' })
    )

    expect(response.status).toBe(307)
    const locationHeader = response.headers.get('Location')
    expect(locationHeader).toEqual(
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/upload-id&expiredsIn=300&contentLength=1024'
    )
  })

  it('returns error if provided request header x-amz-meta-updated-at contains older date than R2 object metadata updated-at', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-amz-meta-updated-at': '2020-01-01T00:00:00.000Z',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(
      getContext(request, { projectId: '1', uploadId: 'miniature' })
    )

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })
})
