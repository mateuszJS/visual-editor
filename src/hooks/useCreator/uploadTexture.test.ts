import uploadTexture from './uploadTexture'
import errorStore from '@/stores/error'
import { interceptRequest, server } from 'test/server'
import { http, HttpResponse } from 'msw'

describe('uploadTexture', () => {
  it('should handle failure coming from fetching blob', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.get(/blob-uuid/, () => {
        return HttpResponse.error()
      })
    )

    const newUrl = await uploadTexture(blobUrl)

    expect(newUrl).toBeNull()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('returns null and sets error message is blob is too big', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.get(/blob-uuid/, () => {
        const threeMB = 3 * 1024 * 1024 // 3MB
        const mockBlobData = new Uint8Array(Array(threeMB + 1).fill(1))
        return HttpResponse.arrayBuffer(mockBlobData.buffer)
      })
    )

    const newUrl = await uploadTexture(blobUrl)

    expect(newUrl).toBeNull()
    expect(errorStore.message).toBe('Max file size is 3 MB.')
  })

  it('throws error if no x-storage-item-id header was returned', async () => {
    const reqPromise = interceptRequest('/api/storage', 'PUT')
    await uploadTexture('blob:http://localhost:3000/blob-uuid')
    const req = await reqPromise

    expect(req.headers.get('x-hash')).toBe('mock-hash')
  })

  it('throws error if no x-storage-item-id header was returned', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.put('/api/storage', () => {
        return new HttpResponse(null, { status: 200 })
      })
    )

    const newUrl = await uploadTexture(blobUrl)

    expect(newUrl).toBeNull()
    expect(errorStore.message).toBe('Failed to upload file.')
  })

  it('should successfully obtain blob and upload to server', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    const newUrl = await uploadTexture(blobUrl)

    expect(newUrl).toBe('/api/storage/storage-item-id')
    expect(errorStore.message).toBeNull()
  })

  it('should handle the failure of signed url generation', async () => {
    const blobUrl = 'blob:http://localhost:3000/blob-uuid'

    server.use(
      http.put('/api/storage', () => {
        return HttpResponse.json({ error: 'Upload failed' }, { status: 400 })
      })
    )

    const newUrl = await uploadTexture(blobUrl)

    expect(newUrl).toBeNull()
    expect(errorStore.message).toBe('Failed to upload file.')
  })
})
