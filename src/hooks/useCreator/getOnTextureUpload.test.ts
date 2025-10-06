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

    await getOnTextureUpload(PROJECT_ID)(regularUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBeNull()
  })

  it('should handle failure when fetching blob URL fails', async () => {
    const blobUrl = 'blob:http://localhost:3000/some-uuid'

    // Mock the blob URL to return an error
    server.use(
      http.get(blobUrl, () => {
        return HttpResponse.error()
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('should successfully fetch blob and upload to server', async () => {
    const blobUrl = 'blob:http://localhost:3000/some-uuid'
    const mockBlobData = new Uint8Array([1, 2, 3, 4])

    const handlerURL = 'http://localhost:3000http://localhost:3000/some-uuid'
    // jest dom has no clue how to handle "blob:" urls, it treats the mas relative so....

    server.use(
      http.get(handlerURL, () => {
        return HttpResponse.arrayBuffer(mockBlobData.buffer)
      })
    )
    server.use(
      http.post('/api/project-uploads/:projectId', () => {
        return new HttpResponse('3', { status: 201 })
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).toHaveBeenCalledWith(`/api/project-uploads/${PROJECT_ID}/3`)
    expect(errorStore.message).toBeNull()
  })

  it('should handle upload API failure', async () => {
    const blobUrl = 'blob:http://localhost:3000/some-uuid'
    const mockBlobData = new Uint8Array([1, 2, 3, 4])

    // Mock the blob URL to return blob data
    server.use(
      http.get(blobUrl, () => {
        return HttpResponse.arrayBuffer(mockBlobData.buffer)
      }),
      // Override the default project-textures handler to return error
      http.post('/api/project-textures', () => {
        return HttpResponse.json({ error: 'Upload failed' }, { status: 400 })
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('should handle upload API network error', async () => {
    const blobUrl = 'blob:http://localhost:3000/some-uuid'
    const mockBlobData = new Uint8Array([1, 2, 3, 4])

    // Mock the blob URL to return blob data
    server.use(
      http.get(blobUrl, () => {
        return HttpResponse.arrayBuffer(mockBlobData.buffer)
      }),
      // Override the default project-textures handler to return network error
      http.post('/api/project-textures', () => {
        return HttpResponse.error()
      })
    )

    await getOnTextureUpload(PROJECT_ID)(blobUrl, mockSetNewUrl)

    expect(mockSetNewUrl).not.toHaveBeenCalled()
    expect(errorStore.message).toBe('Failed to upload file.')
  })
})
