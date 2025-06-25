import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../../supabaseClient'
import getResponseError from '../../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import isValidId from '../../utils/isValidId'

async function downloadProjectAsset(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!isValidId(id)) {
    return getResponseError('Invalid id.')
  }

  const [{ data: dbData, error: dbError }, { data: storageData, error: storageError }] =
    await Promise.all([
      supabaseClient
        .from('project_assets')
        .select()
        .eq('id', Number(id))
        .eq('owner_id', session.userId)
        .single(),
      supabaseClient.storage.from('project-assets').download(id),
    ])

  if (storageError || dbError) {
    return getResponseError('Something went wrong while downloading the file.')
  }

  if (!storageData) {
    return getResponseError('No file found under passed path.', 404)
  }

  const headers = new Headers()
  headers.set('Content-Type', 'image/*')
  return new NextResponse(storageData, { status: 200, statusText: 'OK', headers })
}

export const GET = withSession(downloadProjectAsset)
