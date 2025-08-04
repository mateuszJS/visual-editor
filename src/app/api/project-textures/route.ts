import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../supabaseClient'
import getResponseError from '../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'

async function uploadProjectAsset(session: SessionPayload, request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file || !(file instanceof File)) {
    return getResponseError('File is missing.')
  }

  const { data: dbData, error: dbError } = await supabaseClient
    .from('project_textures')
    .insert({
      owner_id: session.userId,
    })
    .select()
    .single()

  if (dbError) {
    return getResponseError(dbError.message)
  }

  const { error: storageError } = await supabaseClient.storage
    .from('project-textures')
    .upload(dbData.id, file)

  if (storageError) {
    return getResponseError(storageError.message)
  }

  return new NextResponse(dbData.id, { status: 201 })
}

export const POST = withSession(uploadProjectAsset)
