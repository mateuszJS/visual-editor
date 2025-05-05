import { NextRequest } from 'next/server'
import { SessionPayload } from '../session'

const session: SessionPayload = {
  userId: 1,
}

export function withSession(
  handler: (session: unknown, req: unknown, context: unknown) => unknown
) {
  return async (req: NextRequest, context: unknown) => {
    return handler(session, req, context)
  }
}
