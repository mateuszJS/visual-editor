import { NextResponse } from 'next/server'
import { SessionPayload, withAuth } from '@/app/api/session'

async function getUser(session: SessionPayload) {
  return NextResponse.json({
    picture: 'pic',
    firstName: 'John',
    lastName: 'Smith',
  })
}

export const GET = withAuth(getUser)
