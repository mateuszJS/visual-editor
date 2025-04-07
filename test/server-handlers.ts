import { http, HttpResponse } from 'msw'

export const mockUser = jest.fn(
  ({ request }: { request: Request }): Response =>
    HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
)

/*
To mock for a one testcase:
mockUser.mockImplementationOnce(({ request }: { request: Request }) =>
  HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
)
*/

export default [
  http.get('/api/me', mockUser),
  http.delete('/api/auth/logout', () => HttpResponse.json({}, { status: 200 })),
  http.post('/api/auth/login/google', mockUser),
  http.get('/api/csrf', () => HttpResponse.json({ csrfToken: 'csrf-token' }, { status: 200 })),
]
