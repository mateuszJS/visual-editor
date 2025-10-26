import { describe, it, expect } from 'vitest'
import { onRequestGet, onRequestPatch } from '.'
import getContext from '@/test/getContext'
import { aliceSessionToken, bobSessionToken, nonExistingUserSessionToken } from '@/setup'

describe('GET /api/projects/[id]', () => {
  it('returns project if the user is the owner and project exists', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: '1' }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      id: '1',
      assets: [],
    })
  })

  it('returns error if project does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: '-1' }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Project does not exist.',
    })
  })

  it('returns error if user is not the owner of the project', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${bobSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Project does not exist.',
    })
  })

  it('returns error if user does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Project does not exist.' })
  })
})

describe('PATCH /api/projects/[id]', () => {
  it('returns project if successfully updated', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ assets: [{ url: 'texture-url' }] }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(204)
    expect(response.body).toBeNull()
  })

  it('returns error if json is invalid', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: 'invalid-json',
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Invalid JSON payload.',
    })
  })

  it('returns error if project does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ assets: [{ url: 'texture-url' }] }),
    })
    const response = await onRequestPatch(getContext(request, { id: '-1' }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Project does not exist.',
    })
  })

  it('returns error if user is not the owner of the project', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${bobSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ assets: [{ url: 'texture-url' }] }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Project does not exist.',
    })
  })

  it('returns error if user does not exist', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ width: 600, height: 400, assets: [] }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(404)
    const json = await response.json()
    expect(json).toEqual({ error: 'Project does not exist.' })
  })

  it('returns error if width is equal or below 0', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ width: 0 }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Width of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if width is above 3000', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ width: 3001 }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Width of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if height is equal or below 0', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ height: 0 }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Height of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if height is above 3000', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ width: 300, height: 3001 }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Height of the project has to be between 1 and 3000 pixels' })
  })

  it('returns error if assets are not an array', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({ assets: {} }),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Assets must be an array' })
  })

  it('returns error if assets cannot be serialized', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: '{"assets":[invalid json]}',
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    const json = await response.json()
    expect(json).toEqual({ error: 'Invalid JSON payload.' })
  })

  it('returns project if update is empty', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${aliceSessionToken}` },
      method: 'PATCH',
      body: JSON.stringify({}),
    })
    const response = await onRequestPatch(getContext(request, { id: '1' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'No valid fields to update' })
  })
})
