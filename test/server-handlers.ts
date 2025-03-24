import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/me', () => {
    return HttpResponse.json({ firstName: 'John' })
  }),
]

export { handlers }
