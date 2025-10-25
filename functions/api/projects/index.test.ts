import { describe, it, expect } from 'vitest'
import { onRequestPost, onRequestGet } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken, bobSessionToken, nonExistingUserSessionToken } from '@/setup'

describe('POST /api/projects', () => {
  it('returns project if created successfully', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 600, height: 400, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(201)
    const json = await response.json()
    expect(json).toEqual({
      created_at: expect.any(String),
      id: '2',
      last_updated: expect.any(String),
      name: null,
    })
  })

  it('returns error if width is missing', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ height: 400, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Width is required' })
  })

  it('returns error if width is equal or below 0', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 0, height: 400, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Width of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if width is above 3000', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 3001, height: 400, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Width of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if height is missing', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 300, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Height is required' })
  })

  it('returns error if height is equal or below 0', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 300, height: 0, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Height of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if height is above 3000', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 300, height: 3001, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Height of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if assets are missing', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 300, height: 400 }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Assets are required' })
  })

  it('returns error if assets are not an array', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 300, height: 400, assets: {} }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Assets must be an array' })
  })

  it('returns error if assets cannot be serialized', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'POST',
      body: '{"width":300,"height":400,"assets":[invalid json]}',
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Invalid JSON payload.' })
  })

  it('returns error if user does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
      method: 'POST',
      body: JSON.stringify({ width: 600, height: 400, assets: [] }),
    })
    const response = await onRequestPost(getContext(request))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Failed to create a project.' })
  })
})

describe('GET /api/projects', () => {
  it('returns list of projects if user is signed in', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual([
      {
        created_at: expect.any(String),
        id: '1',
        last_updated: expect.any(String),
        name: null,
      },
    ])
  })

  it('returns empty list if user does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
    })
    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual([])
  })

  it('returns 401 if user is not signed in', async () => {
    const request = new Request('x:')
    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(401)
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })

  it('returns empty list if user does not have projects', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${bobSessionToken}` },
    })
    const response = await onRequestGet(getContext(request))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json).toEqual([])
  })
})
