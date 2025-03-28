import { http, HttpResponse } from 'msw'

export const mockApiMe = jest.fn(() =>
  HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
)

/*
To mock for a one testcase:
mockApiMe.mockImplementationOnce(() =>
  HttpResponse.json({ firstName: 'John', lastName: 'Smith' }, { status: 200 })
)
*/

export default [http.get('/api/me', mockApiMe)]
