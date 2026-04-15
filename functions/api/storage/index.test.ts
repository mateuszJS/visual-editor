import { describe, it, expect, vi } from 'vitest'
import { onRequestPut } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken } from '@/setup'

const file = new File(['image-data'], 'image-blob.png', { type: 'image/png' })

describe('PUT /api/storage', () => {
  it('if everything is correct redirects to cloud provider url', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request))

    expect(response.status).toBe(200)
    expect(response.headers.get('x-storage-item-id')).toBe('si_random-uuid-1')
  })

  it('returns error if x-hash header was not provided', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request))

    const json = await response.json()

    expect(json).toEqual({
      error: 'Hash provided via x-hash is required',
    })
  })

  it('returns error if content-type header was not provided', async () => {
    // const file =
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: new File(['image-data'], 'image-blob.png'),
    })
    const response = await onRequestPut(getContext(request))

    const json = await response.json()

    expect(json).toEqual({
      error: 'Invalid content type.',
    })
  })

  it('returns error if provided content-type header is not supported', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: new File(['image-data'], 'image-blob.png', { type: 'application/pdf' }),
    })
    const response = await onRequestPut(getContext(request))

    const json = await response.json()

    expect(json).toEqual({
      error: 'Invalid content type.',
    })
  })

  it('returns error if userUploads.put fails', async () => {
    // import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
    // vi.mocked(getSignedUrl).mockRejectedValueOnce(new Error('S3 utility has failed'))
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '1024',
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: file,
    })

    const ctx = getContext(request)
    vi.spyOn(ctx.env.userUploads, 'put').mockRejectedValueOnce(new Error('Failed to put'))

    const response = await onRequestPut(ctx)

    expect(response.status).toBe(500)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Upload has failed.',
    })
  })

  it('returns error if content-length header is not present', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Max file size is 3 MB.',
    })
  })

  it('returns error if contentLength is below or equal to 0', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': '0',
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Max file size is 3 MB.',
    })
  })

  it('returns error if contentLength is above 3MB', async () => {
    const request = new Request('x:', {
      headers: {
        Cookie: `session=${aliceSessionToken}`,
        'Content-Length': (3 * 1024 * 1024 + 1).toString(),
        'x-hash': 'hash-mock',
      },
      method: 'PUT',
      body: file,
    })
    const response = await onRequestPut(getContext(request, { projectId: '1' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Max file size is 3 MB.' })
  })

  it('returns error if user is not signed in', async () => {
    const response = await onRequestPut(getContext(new Request('x:'), { projectId: '1' }))

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })
})
