import 'server-only'
import { NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/session'
import supabase from '@/utils/supabaseClient'
import getResponseError from '../utils/getResponseError'
import sanitizeUserData from '../utils/sanitizeUserData'

async function getUser(session: SessionPayload) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', parseInt(session.userId))
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  return NextResponse.json(sanitizeUserData(data))
}

export const GET = withSession(getUser)
