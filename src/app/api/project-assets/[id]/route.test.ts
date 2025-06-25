import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { GET } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

const blob = new Blob(['image-blob'], { type: 'image/png' })
const fileExample = new File([blob], 'image-blob.png')

describe('downloadProjectAsset', () => {
  beforeEach(async () => {
    dbMock.storage['project-assets']['1'] = fileExample
  })

  test('returns blob if asset id is correct and file exists', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/1',
      }),
      mockNextContext({ id: '1' })
    )

    const blob = await response.blob()
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/*')
    const content = await blob.text()
    expect(content).toBe('image-blob')
  })

  test('returns error if there is no asset with passed id', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/2',
      }),
      mockNextContext({ id: '2' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Something went wrong while downloading the file.',
    })
  })

  test('returns error if id is invalid', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/invalid-id',
      }),
      mockNextContext({ id: 'invalid-id' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Invalid id.',
    })
  })

  test('returns error if there is an error from the database', async () => {
    __setErrorQueue([new Error('Error during upload')])
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/1',
      }),
      mockNextContext({ id: '1' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Something went wrong while downloading the file.',
    })
  })

  test('propagates error from db to be returned in response', async () => {
    __setErrorQueue([null, new Error('Error during upload')])
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/1',
      }),
      mockNextContext({ id: '1' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Something went wrong while downloading the file.',
    })
  })

  test('returns error if user is not the owner of the asset', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets/4',
      }),
      mockNextContext({ id: '4' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Something went wrong while downloading the file.',
    })
  })
})
