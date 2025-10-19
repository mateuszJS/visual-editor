import { parse } from 'cookie'

export function withCSRFProtection<Params extends string = never, Data = never>(
  handler: Handler<Params, Data>
): Handler<Params, Data> {
  return async (ctx) => {
    const cookie = parse(ctx.request.headers.get('Cookie') || '')
    const csrfTokenFromCookie = cookie['csrf-token']

    const csrfTokenFromHeader = ctx.request.headers.get('x-csrf-token')

    if (!csrfTokenFromCookie || csrfTokenFromCookie !== csrfTokenFromHeader) {
      return Response.json(
        { error: 'Invalid CSRF token' },
        {
          status: 403,
        }
      )
    }

    return handler(ctx)
  }
}
