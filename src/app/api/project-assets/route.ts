import { NextRequest, NextResponse } from 'next/server'
import supabaseClient from '../supabaseClient'
import getResponseError from '../utils/getResponseError'
import { v4 as uuidv4 } from 'uuid'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import isValidId from '../utils/isValidId'

async function uploadFile(file: Blob, fileName: string, projectId: string) {
  const fileExtension = fileName.split('.').pop()
  const uniqueFileName = `${uuidv4()}.${fileExtension}`
  /* we do not use real file name because it can be too long and cutting it might
  create two exactly same looking strings */

  const filePath = `${projectId}/${new Date().toISOString().replaceAll(':', '_')}/${uniqueFileName}`
  // colons might cause troubles in AWS S3 namign convention
  return supabaseClient.storage.from('project-assets').upload(filePath, file)
}

async function uploadProjectAsset(session: SessionPayload, request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const projectId = formData.get('projectId') as string

  if (!isValidId(projectId)) {
    return getResponseError('Invalid project id.')
  }

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

async function downloadProjectAsset(session: SessionPayload, request: NextRequest) {
  const path = request?.nextUrl?.searchParams.get('path')
  if (!path) {
    return getResponseError('Path is missing.')
  }

  let decodedPath = ''
  try {
    decodedPath = decodeURIComponent(path)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return getResponseError('Invalid path.')
  }

  const { data, error } = await supabaseClient.storage.from('project-assets').download(decodedPath)

  if (error) {
    return getResponseError('Something went wrong while downloading the file.')
  }

  if (!data) {
    return getResponseError('No file found under passed path.', 404)
  }

  const headers = new Headers()
  headers.set('Content-Type', 'image/*')
  return new NextResponse(data, { status: 200, statusText: 'OK', headers })
}

export const GET = withSession(downloadProjectAsset)
