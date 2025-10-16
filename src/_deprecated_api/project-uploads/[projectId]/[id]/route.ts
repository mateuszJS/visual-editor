import { NextRequest, NextResponse } from 'next/server'
import getResponseError from '../../../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import gcpStorageClient from '../../../gcpStorageClient'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import supabaseClient from '@/app/api/supabaseClient'
import { BUCKET_NAME } from '@/app/api/consts'

async function downloadProjectAsset(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ projectId: string; id: string }> }
) {
  const { id, projectId } = await context.params

  const { data: project, error: projectError } = await supabaseClient
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('owner_id', session.userId)
    .single()

  if (projectError || !project) {
    return getResponseError('Access denied or project not found.', 403)
  }

  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  } as const

  try {
    // Get a v4 signed URL for reading the file
    const [signedUrl] = await gcpStorageClient
      .bucket(BUCKET_NAME)
      .file(`${projectId}/${id}`)
      .getSignedUrl(options)

    return NextResponse.redirect(signedUrl, 307)
  } catch (error) {
    return getResponseError(getErrorMessage(error), 404)
  }
}

export const GET = withSession(downloadProjectAsset)
