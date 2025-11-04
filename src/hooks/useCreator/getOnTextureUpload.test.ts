import getOnTextureUpload from './getOnTextureUpload'
import errorStore from '@/stores/error'
import { server } from 'test/server'
import { http, HttpResponse } from 'msw'

const PROJECT_ID = '1'

describe('getOnTextureUpload', () => {
  const mockSetNewUrl = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    errorStore.message = null
  })

  it('should not call endpoint when URL does not start with "blob:"', async () => {
    const regularUrl = 'https://example.com/image.jpg'

    let apiWasCalled = false
    server.use(
      http.post(`/api/project-uploads/:projectId/access-url`, () => {
        apiWasCalled = true
        return new HttpResponse(null, { status: 201 })
      })
    )

    await getOnTextureUpload(PROJECT_ID)(regularUrl, mockSetNewUrl)

    expect(apiWasCalled).toBe(false)
    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBeNull()
  })

  it('should handle failure when fetching blob URL fails', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.get(/blob-uuid/, () => {
        return HttpResponse.error()
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('should successfully obtain blob and upload to server', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).toHaveBeenCalledWith(`/api/project-uploads/${PROJECT_ID}/new-upload-id`)
    expect(errorStore.message).toBeNull()
  })

  it('should handle the failure of signed url generation', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.put('/api/project-uploads/:projectId', () => {
        return HttpResponse.json({ error: 'Upload failed' }, { status: 400 })
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })
})
