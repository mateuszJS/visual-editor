import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../supabaseClient'
import getResponseError from '../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'

async function uploadProjectAsset(session: SessionPayload, request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || !(file instanceof File)) {
    return getResponseError('File is missing or invalid.')
  }

  const { data: dbData, error: dbError } = await supabaseClient
    .from('project_assets')
    .insert({
      owner_id: session.userId,
    })
    .select()
    .single()

  if (dbError) {
    return getResponseError(dbError.message)
  }

  const { error: storageError } = await supabaseClient.storage
    .from('project-assets')
    .upload(dbData.id.toString(), file)

  if (storageError) {
    return getResponseError(storageError.message)
  }

  return NextResponse.json(
    {
      id: dbData.id.toString(),
    },
    { status: 201 }
  )
}

export const POST = withSession(uploadProjectAsset)
