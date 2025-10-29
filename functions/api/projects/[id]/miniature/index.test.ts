import { describe, it, expect } from 'vitest'
import { onRequestGet } from '.'
import getContext from '@/test/getContext'
import {
  aliceProjectId,
  aliceSessionToken,
  bobSessionToken,
  nonExistingUserSessionToken,
} from '@/setup'

describe('GET /api/projects/[id]/miniature', () => {
  // it('returns project if the user is the owner and project exists', async () => {
  //   const request = new Request('x:', {
  //     headers: { Cookie: `session=${aliceSessionToken}` },
  //   })
  //   const response = await onRequestGet(getContext(request, { id: '1' }))

  //   expect(response.status).toBe(200)
  //   expect(await response.json()).toEqual({
  //     id: '1',
  //     assets: [],
  //   })
  // })

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
    const response = await onRequestGet(getContext(request, { id: aliceProjectId }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Project does not exist.',
    })
  })

  it('returns error if user does not exist(sends malformed session cookie)', async () => {
    const request = new Request('x:', {
      headers: { Cookie: `session=${nonExistingUserSessionToken}` },
    })
    const response = await onRequestGet(getContext(request, { id: aliceProjectId }))

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Project does not exist.' })
  })
})
