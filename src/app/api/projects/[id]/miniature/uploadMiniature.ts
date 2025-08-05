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

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file || !(file instanceof File)) {
    return getResponseError('File is missing.')
  }

  const { error: projectError } = await supabaseClient
    .from('projects')
    .select()
    .eq('id', id)
    .eq('owner_id', session.userId)
    .single()

  if (projectError) {
    return getResponseError(projectError.message)
  }

  const { error: storageError } = await supabaseClient.storage
    .from('project-miniatures')
    .upload(id, file, {
      upsert: true,
    })

  if (storageError) {
    return getResponseError(storageError.message)
  }

  return new NextResponse(null, { status: 204 })
}
