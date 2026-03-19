import { http, HttpResponse } from 'msw'

const file = new File(['image-data'], 'image-blob.png', { type: 'image/png' })
const mockBlobData = new Uint8Array([1, 2, 3, 4])

export default [
  http.get('/api/me', () => {
    return HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
  }),
  http.delete('/api/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/auth/login/google', () => {
    return HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
  }),
  http.get('/api/csrf', () => {
    return HttpResponse.json({ csrfToken: 'csrf-token' }, { status: 200 })
  }),
  http.get('/api/projects/:id', () => {
    return HttpResponse.json({ id: '1' }, { status: 200 })
  }),
  http.get('/api/projects', () => {
    return HttpResponse.json([{ id: '1' }, { id: '2' }], { status: 200 })
  }),
  http.post('/api/projects', () => {
    return HttpResponse.json({ id: '1' }, { status: 201 })
  }),
  http.patch('/api/projects/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.put('/api/project-uploads/:projectId', () => {
    // jsdom fetch does not follow 307 redirects, so I hade to use 303 instead
    return HttpResponse.redirect('https://storage-provider.com/projectId/new-upload-id', 303)
  }),
  // TODO: once we get rid of jest & jsdom, lets change this get to put to actually replicate how prod works
  http.get('https://storage-provider.com/projectId/new-upload-id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/api/project-uploads/:projectId/:uploadId', () => {
    return new HttpResponse(file, { status: 204 })
  }),
  http.get(/blob-uuid/, () => {
    return HttpResponse.arrayBuffer(mockBlobData.buffer)
  }),
  http.put('/api/project-uploads/:projectId/miniature', async () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
