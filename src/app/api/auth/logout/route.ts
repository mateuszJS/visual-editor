import 'server-only'
import { withSession } from '@/app/api/wrappers/session'
import { NextResponse } from 'next/server'

async function logout() {
  const response = new NextResponse(null, { status: 204 })
  response.cookies.delete('session')
  return response
}

export const DELETE = withSession(logout)
