import { NextResponse } from 'next/server'
import { withAuth } from '@/app/api/session'

async function getUser() {
  return NextResponse.json({
    picture: 'pic',
    firstName: 'John',
    lastName: 'Smith',
  })
}

export const GET = withAuth(getUser)
