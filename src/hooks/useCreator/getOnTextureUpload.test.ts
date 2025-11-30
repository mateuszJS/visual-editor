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

    server.use(
      http.post('https://example.com/image.jpg', () => {
        throw Error('API should not have been called')
      })
    )

    await getOnTextureUpload(PROJECT_ID)(regularUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBeNull()
  })

  it('should handle failure coming from fetching blob', async () => {
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
