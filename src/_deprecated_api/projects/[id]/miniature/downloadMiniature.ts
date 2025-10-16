import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from 'app/api/supabaseClient'
import getResponseError from 'app/api/utils/getResponseError'
import { SessionPayload } from 'app/api/wrappers/session'

export default async function uploadMiniature(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  if (!id) {
    return getResponseError('No id provided.')
  }

  const [{ error: dbError }, { data: storageData, error: storageError }] = await Promise.all([
    supabaseClient.from('projects').select().eq('id', id).eq('owner_id', session.userId).single(),
    supabaseClient.storage.from('project-miniatures').download(id),
  ])

  if (storageError || dbError) {
    return getResponseError('Something went wrong while downloading the miniature.')
  }

  if (!storageData) {
    return getResponseError('No miniature found for this project.', 404)
  }

  const headers = new Headers()
  headers.set('Content-Type', 'image/*')
  return new NextResponse(storageData, { status: 200, statusText: 'OK', headers })
}
