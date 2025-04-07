import 'server-only'
import { NextResponse } from 'next/server'
import { withSession } from '@/app/api/session'

async function getUser() {
  return NextResponse.json({
    picture: 'pic',
    firstName: 'John',
    lastName: 'Smith',
  })
}

export const GET = withSession(getUser)
