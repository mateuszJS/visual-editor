import 'server-only'
import { NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/session'
import supabaseClient from '@/app/api/supabaseClient'
import getResponseError from '../utils/getResponseError'
import sanitizeUserData from '../utils/sanitizeUserData'

async function getUser(session: SessionPayload) {
  const { data, error } = await supabaseClient.from('users').select().eq('id', session.userId)

  if (error) {
    return getResponseError(error.message)
  }

  if (data?.length !== 1) {
    return getResponseError('User not found.', 404)
  }

  return NextResponse.json(sanitizeUserData(data[0]))
}

export const GET = withSession(getUser)
