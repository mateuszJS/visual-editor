import { __getCleanDBMock, __setErrorQueue } from '@/app/api/supabaseClient'
import { bucketsMock, __mockBucketError, __getCleanBucketsMock } from '@google-cloud/storage'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { POST } from './route'
import { BUCKET_NAME } from '@/app/api/consts'

jest.mock('@/app/api/supabaseClient')
jest.mock('@/app/api/wrappers/session')
jest.mock('uuid', () => ({ v4: () => '4' }))

const arrayBuffer = Buffer.from([1, 2, 3])
const blob = new Blob([arrayBuffer], { type: 'image/png' })
const file = new File([blob], 'image-blob.png', { type: blob.type })

const uploadAssetRequest = createMockNextRequest({
  formData: {
    file: [file], // TODO: array migt be unnecesary ere
  },
})

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext({ projectId: '1' }))
    const json = await response.text()

    expect(json).toEqual('4')

    const expectedDB = __getCleanBucketsMock()

    expectedDB[BUCKET_NAME]['1/4'] = {
      buffer: arrayBuffer,
      metadata: {
        contentType: 'image/png',
      },
    }

    expect(bucketsMock).toEqual(expectedDB)
  })

  test('returns error if user is not the owner of the project', async () => {
    const response = await POST(uploadAssetRequest, mockNextContext({ projectId: '-1' }))
    const json = await response.json()

    expect(json).toEqual({
      error: 'Access denied or project not found.',
    })
  })

  test('returns error if database insert fails', async () => {
    __mockBucketError('Some custom error message.')
    const response = await POST(uploadAssetRequest, mockNextContext({ projectId: '1' }))
    const json = await response.json()

    expect(json).toEqual({
      error: 'Some custom error message.',
    })
  })

  test('returns error if there is no file', async () => {
    const response = await POST(
      createMockNextRequest({ formData: {} }),
      mockNextContext({ projectId: '1' })
    )
    const json = await response.json()

    expect(json).toEqual({
      error: 'File is missing.',
    })
  })
})
