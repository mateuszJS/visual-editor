import getOnTextureUpload from './uploadTexture'
import errorStore from '@/stores/error'
import { server } from 'test/server'
import { http, HttpResponse } from 'msw'

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

    await getOnTextureUpload(regularUrl, mockSetNewUrl)

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

    await getOnTextureUpload(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('should successfully obtain blob and upload to server', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    await getOnTextureUpload(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).toHaveBeenCalledWith(`/api/storage/si_new-upload-uuid`)
    expect(errorStore.message).toBeNull()
  })

  it('should handle the failure of signed url generation', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.put('/api/storage', () => {
        return HttpResponse.json({ error: 'Upload failed' }, { status: 400 })
      })
    )

    await getOnTextureUpload(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })
})
