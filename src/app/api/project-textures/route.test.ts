import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { POST } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')

const file = new File([new Blob(['image-blob'], { type: 'image/png' })], 'image-blob.png')

const uploadAssetRequest = createMockNextRequest({
  formData: {
    file: [file],
  },
})

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.text()

    expect(json).toEqual('4')

    const expectedDB = __getCleanDBMock()
    expectedDB.tables.project_textures.push({
      id: '4',
      owner_id: '1',
    })
    expectedDB.storage['project-textures']['4'] = file
    expect(dbMock).toEqual(expectedDB)
  })

  test('returns success & error data if storage upload fails', async () => {
    __setErrorQueue([null, new Error('Error during upload.')])
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Error during upload.',
    })
  })

  test('returns error if database insert fails', async () => {
    __setErrorQueue([new Error('Error during upload.')])
    const response = await POST(uploadAssetRequest, mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'Error during upload.',
    })
  })

  test('returns error if there is no file', async () => {
    const response = await POST(createMockNextRequest({ formData: {} }), mockNextContext())
    const json = await response.json()

    expect(json).toEqual({
      error: 'File is missing.',
    })
  })
})
