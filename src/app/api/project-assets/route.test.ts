import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { POST } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

const blob = new Blob(['image-blob'], { type: 'image/png' })
const fileExample = new File([blob], 'image-blob.png')

const uploadAssetRequest = createMockNextRequest({
  formData: {
    file: fileExample,
  },
})

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      id: '4',
    })

    const expectedDB = __getCleanDBMock()
    expectedDB.tables.project_assets.push({
      id: 4,
      owner_id: 1,
    })
    expectedDB.storage['project-assets']['4'] = fileExample
    expect(dbMock).toEqual(expectedDB)
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
    const response = await POST(createMockNextRequest({ formData: {} }), mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'File is missing or invalid.',
    })
  })
})
