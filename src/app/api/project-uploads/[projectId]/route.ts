import { NextRequest, NextResponse } from 'next/server'
import getResponseError from '../../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import { v4 as uuidv4 } from 'uuid'

// Imports the Google Cloud client library
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import gcpStorageClient from '@/app/api/gcpStorageClient'
import supabaseClient from '@/app/api/supabaseClient'
import { BUCKET_NAME } from '@/app/api/consts'

async function uploadProjectAsset(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file || !(file instanceof File)) {
    return getResponseError('File is missing.')
  }

  const { data: project, error: projectError } = await supabaseClient
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('owner_id', session.userId)
    .single()

  if (projectError || !project) {
    return getResponseError('Access denied or project not found.', 403)
  }

  const uploadId = uuidv4()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await gcpStorageClient.bucket(BUCKET_NAME).file(`${projectId}/${uploadId}`).save(buffer, {
      contentType: file.type,
    })
  } catch (error) {
    return getResponseError(getErrorMessage(error))
  }

  return new NextResponse(uploadId, { status: 201 })
}

export const POST = withSession(uploadProjectAsset)
