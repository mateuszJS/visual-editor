import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'
import mockNextContext from '@/app/api/test/mockNextContext'
import { uploadProjectAsset } from './route'

jest.mock('@/app/api/supabaseClient')
jest.mock('uuid', () => ({ v4: () => '123' }))

const blob = new Blob(['image-blob'], { type: 'image/png' })
const fileExample = new File([blob], 'image-blob.png')

const request = createMockNextRequest({
  formData: {
    file: fileExample,
  },
})

describe('uploadProjectAsset', () => {
  test('returns path if file was uploaded correctly', async () => {
    const response = await uploadProjectAsset(
      { userId: 1 },
      request,
      mockNextContext({ projectId: '1' })
    )
    const json = await response.json()
    const expectedPath =
      '1' /*project id*/ +
      '/' +
      '2024-01-01T00_00_00.000Z' /*ISO date*/ +
      '/' +
      '123' /*uuid v4*/ +
      '.png' /*file extension*/

    expect(json).toEqual({
      path: expectedPath,
    })

    const expectedDB = __getCleanDBMock()
    expectedDB.storage['project-assets'][expectedPath] = fileExample
    expect(dbMock).toEqual(expectedDB)
  })
})
