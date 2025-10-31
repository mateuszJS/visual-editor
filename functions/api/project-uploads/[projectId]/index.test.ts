import { describe, it, expect, vi } from 'vitest'
import { onRequestPut } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken } from '@/setup'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const file = new File(['image-data'], 'image-blob.png', { type: 'image/png' })

describe('PUT /api/project-uploads/[projectId]', () => {
  it('if everything is correct redirects to cloud provider url', async () => {
    const request = new Request('x:?contentLength=1024', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(308)
    const locationHeader = response.headers.get('Location')
    expect(locationHeader).toEqual(
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/uuid-generated-id&expiredsIn=300&contentLength=1024'
    )
  })

  it('returns error if user is not the owner of the project', async () => {
    const request = new Request('x:?contentLength=1024', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '-1' }))

    const json = await response.json()

    expect(json).toEqual({
      error: 'Failed to generate signed URL.',
    })
  })

  it('returns error if there is an error thrown in s3 lib', async () => {
    vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 utility has failed'))
    const request = new Request('x:?contentLength=1024', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

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
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

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
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

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
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Failed to generate signed URL.' })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestPut(getContext(new Request('x:'), { projectId: '1' }))

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  it('redirects to cloud provider url with predefined uploadId from query params', async () => {
    const request = new Request('x:?uploadId=custom-upload-id&contentLength=1024', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(308)
    const locationHeader = response.headers.get('Location')
    expect(locationHeader).toEqual(
      'https://storage-provider.com/signed-url?bucket=user-uploads-preview&key=1/custom-upload-id&expiredsIn=300&contentLength=1024'
    )
  })
})
