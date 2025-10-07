import { __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { GET } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

describe('downloadProjectAsset', () => {
  test('redirects if everything is right (project exists, user is the owner, signed url generated with no errors', async () => {
    const response = await GET(
      createMockNextRequest(),
      mockNextContext({ projectId: '1', id: '1' })
    )

    expect(response.status).toBe(307)
    expect(response.headers.get('Location')).toMatch('https://storage.googleapis.com/')
  })

  test('returns error if there is no project with passed id', async () => {
    const response = await GET(
      createMockNextRequest(),
      mockNextContext({ projectId: '-1', id: '1' })
    )

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Access denied or project not found.',
    })
  })

  test('returns error if there is user is not the owner of the project', async () => {
    const response = await GET(
      createMockNextRequest(),
      mockNextContext({ projectId: '3', id: '1' })
    )

    expect(response.status).toBe(403)
    const json = await response.json()
    expect(json).toEqual({
      error: 'Access denied or project not found.',
    })
  })

  test('returns error if there is an error from the database', async () => {
    __setErrorQueue([new Error('Any error ')])
    const response = await GET(
      createMockNextRequest(),
      mockNextContext({ projectId: '1', id: '1' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Access denied or project not found.',
    })
  })
})
