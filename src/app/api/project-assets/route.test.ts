import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { POST } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

const firstFile = new File(
  [new Blob(['first-image-blob'], { type: 'image/png' })],
  'first-image-blob.png'
)
const secondFile = new File(
  [new Blob(['second-image-blob'], { type: 'image/png' })],
  'second-image-blob.png'
)

const uploadAssetRequest = createMockNextRequest({
  formData: {
    'files[]': [firstFile, secondFile],
  },
})

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      succeeded: ['4', '5'],
      failed: [],
    })

    const expectedDB = __getCleanDBMock()
    expectedDB.tables.project_assets.push(
      {
        id: '4',
        owner_id: '1',
      },
      {
        id: '5',
        owner_id: '1',
      }
    )
    expectedDB.storage['project-assets']['4'] = firstFile
    expectedDB.storage['project-assets']['5'] = secondFile
    expect(dbMock).toEqual(expectedDB)
  })

  test('returns success & error data if storage upload fails', async () => {
    __setErrorQueue([null, new Error('Error during upload')])
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      succeeded: ['5'],
      failed: [
        {
          file: 'first-image-blob.png',
          error: 'Error during upload',
        },
      ],
    })
  })

  test('returns error if database insert fails', async () => {
    __setErrorQueue([new Error('Error during upload')])
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Error during upload',
    })
  })

  test('returns error if there is no file', async () => {
    const response = await POST(createMockNextRequest({ formData: {} }), mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Files are missing.',
    })
  })
})
