import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { GET } from './route'
import { __setErrorQueue } from '@/app/api/supabaseClient'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

describe('getProjectsList', () => {
  test('returns list of projects owned by user', async () => {
    const response = await GET(createMockNextRequest(), mockNextContext())
    const json = await response.json()

    expect(json).toEqual([
      {
        id: '1',
        owner_id: '1',
      },
      {
        id: '2',
        owner_id: '1',
      },
    ])
  })

  test('propagates error that occured during obtaining the list of projects from DB', async () => {
    __setErrorQueue([new Error('Error during fetch')])
    const response = await GET(createMockNextRequest(), mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Error during fetch',
    })
  })
})
