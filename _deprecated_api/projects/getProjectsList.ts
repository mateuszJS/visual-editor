import { NextResponse } from 'next/server'
import supabaseClient from '../supabaseClient'
import getResponseError from '../utils/getResponseError'
import sanitizeProjectMetaData from '../utils/sanitizeProjectMetaData'
import { SessionPayload } from '../wrappers/session'

export default async function getProjectsList(session: SessionPayload) {
  const { data, error } = await supabaseClient
    .from('projects')
    .select()
    .eq('owner_id', session.userId)
    .order('last_updated', { ascending: true })

  if (error) {
    return getResponseError(error.message)
  }

  return NextResponse.json(
    data.map((project) => sanitizeProjectMetaData(project)),
    { status: 200 }
  )
}
