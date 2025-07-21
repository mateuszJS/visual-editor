import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../supabaseClient'
import getResponseError from '../utils/getResponseError'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'

async function uploadProjectAsset(session: SessionPayload, request: NextRequest) {
  const formData = await request.formData()
  const files = formData.getAll('files[]') as File[]

  if (!files || files.length === 0) {
    return getResponseError('Files are missing.')
  }

  const { data: dbData, error: dbError } = await supabaseClient
    .from('project_textures')
    .insert(
      new Array(files.length).fill({
        owner_id: session.userId,
      })
    )
    .select()

  if (dbError) {
    return getResponseError(dbError.message)
  }

  const results = await Promise.all(
    dbData.map((item, i) =>
      supabaseClient.storage.from('project-textures').upload(item.id, files[i])
    )
  )

  const successfullyUploadedIds = results
    .map((result, i) => ({ ...result, id: dbData[i].id }))
    .filter((result) => !result.error)
    .map((result) => result.id)

  const filesWhichUploadFailed = results
    .map((result, i) => ({ ...result, file: files[i] }))
    .filter((result) => result.error)
    .map((result) => ({
      file: result.file.name,
      error: result.error!.message,
    }))

  return NextResponse.json(
    {
      succeeded: successfullyUploadedIds,
      failed: filesWhichUploadFailed,
    },
    { status: 201 }
  )
}

export const POST = withSession(uploadProjectAsset)
