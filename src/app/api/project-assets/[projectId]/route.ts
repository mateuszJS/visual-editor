import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../../supabaseClient'
import getResponseError from '../../utils/getResponseError'
import { v4 as uuidv4 } from 'uuid'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import getValidId from '../../utils/getValidId'

async function uploadFile(file: Blob, fileName: string, projectId: number) {
  const fileExtension = fileName.split('.').pop()
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  /* we do not use real file name because it can be too long and cutting it might
  create two exactly same looking strings */

  const filePath = `${projectId}/${new Date().toISOString().replaceAll(':', '_')}/${uniqueFileName}`
  // colons might cause troubles in AWS S3 namign convention
  return supabaseClient.storage.from('project-assets').upload(filePath, file)
}

async function uploadProjectAsset(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const projectId = await getValidId(context, 'projectId') // TODO: change this to a wrapper around endpoint handler
  if (projectId === null) {
    return getResponseError('Invalid project id.')
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (file) {
    const { error, data } = await uploadFile(file, file.name, projectId)
    if (error) {
      return getResponseError(error.message)
    }

    return NextResponse.json(
      {
        path: data.path,
      },
      { status: 201 }
    )
  }

  return getResponseError('Payload is missing the file.')
}

export const POST = withSession(uploadProjectAsset)
