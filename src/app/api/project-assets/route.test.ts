import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { GET, POST } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')
jest.mock('uuid', () => ({ v4: () => '123' }))

const blob = new Blob(['image-blob'], { type: 'image/png' })
const fileExample = new File([blob], 'image-blob.png')

const uploadAssetRequest = createMockNextRequest({
  formData: {
    projectId: '1',
    file: fileExample,
  },
})

const expectedPath =
  '1' /*project id*/ +
  '/' +
  '2024-01-01T00_00_00.000Z' /*ISO date*/ +
  '/' +
  '123' /*uuid v4*/ +
  '.png' /*file extension*/

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      path: expectedPath,
    })

    const expectedDB = __getCleanDBMock()
    expectedDB.storage['project-assets'][expectedPath] = fileExample
    expect(dbMock).toEqual(expectedDB)
  })

  test('returns error if project id is invalid', async () => {
    const invalidIdRequest = createMockNextRequest({
      formData: {
        projectId: '-1',
        file: fileExample,
      },
    })

    const response = await POST(invalidIdRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Invalid project id.',
    })
  })

  test('returns error if upload failed', async () => {
    __setErrorQueue([new Error('Error during upload')])
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Error during upload',
    })
  })

  test('returns error if there is no file', async () => {
    const response = await POST(
      createMockNextRequest({ formData: { projectId: '1' } }),
      mockNextContext()
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Payload is missing the file.',
    })
  })
})

describe('downloadProjectAsset', () => {
  beforeEach(async () => {
    await POST(uploadAssetRequest, mockNextContext())
  })

  test('returns blob if path is correct and file exists', async () => {
    await POST(uploadAssetRequest, mockNextContext())
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets?path=' + expectedPath,
      }),
      mockNextContext()
    )

    const blob = await response.blob()
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/*')
    const content = await blob.text()
    expect(content).toBe('image-blob')
  })

  test('returns error if there is no path', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets' + expectedPath,
      }),
      mockNextContext()
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Path is missing.',
    })
  })

  test('returns error if path is invalid', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets?path=%E0%A4%A',
      }),
      mockNextContext()
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Invalid path.',
    })
  })

  test('returns error if there is an error od storage side', async () => {
    __setErrorQueue([new Error('Error during upload')])
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets?path=' + expectedPath,
      }),
      mockNextContext()
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'Something went wrong while downloading the file.',
    })
  })

  test('returns error if there is no file', async () => {
    const response = await GET(
      createMockNextRequest({
        url: 'https://example.com/api/project-assets?path=' + expectedPath.replace('.png', '.jpg'),
      }),
      mockNextContext()
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'No file found under passed path.',
    })
  })
})
