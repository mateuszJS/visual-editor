import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import getResponseError from '@/app/api/utils/getResponseError'
import supabaseClient from '@/app/api/supabaseClient'

async function getProject(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return getResponseError('No id provided.')
  }

  const { data: projectData, error: projectError } = await supabaseClient
    .from('projects')
    .select()
    .eq('id', id)
    .eq('owner_id', session.userId)
    .single()

  if (projectError) {
    return getResponseError(projectError.message)
  }

  let miniature: Blob | null = null
  console.log('miniature_created_at', projectData.miniature_created_at)
  console.log('created_at', projectData.created_at)
  if (
    !projectData.miniature_created_at ||
    projectData.last_updated > projectData.miniature_created_at
  ) {
    console.log('GENERATE')
    // generate miniature
    // eslint-disable-next-line no-restricted-syntax
    const blob = await fetch(
      'https://images.pexels.com/photos/20718261/pexels-photo-20718261.jpeg'
    ).then((response) => response.blob())
    const file = new File([blob], 'miniature.png', { type: 'image/png' })

    // upload storage
    const { error: uploadError } = await supabaseClient.storage
      .from('project-miniatures')
      .upload(id, file, {
        upsert: true,
      })

    if (uploadError) {
      console.error(uploadError)
      return getResponseError('Something went wrong while updating the project miniature.')
    }

    // update db
    const { error: updateError } = await supabaseClient
      .from('projects')
      .update({
        miniature_created_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('owner_id', session.userId)
      .single()

    if (updateError) {
      return getResponseError('Something went wrong while updating the project.')
    }

    miniature = blob
  } else {
    const { data: storageData, error: storageError } = await supabaseClient.storage
      .from('project-miniatures')
      .download(id)

    if (storageError) {
      return getResponseError('Something went wrong while downloading the project miniature.')
    }

    miniature = storageData
  }

  if (!miniature) {
    return getResponseError('No project miniature found.', 404)
  }

  const headers = new Headers()
  headers.set('Content-Type', 'image/*')
  return new NextResponse(miniature, { status: 200, statusText: 'OK', headers })
}

export const GET = withSession(getProject)
