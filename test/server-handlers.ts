import { http, HttpResponse } from 'msw'

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
  http.post('/api/project-assets', () => {
    return HttpResponse.json({ succeded: ['3'], failed: [] }, { status: 201 })
  }),
]
