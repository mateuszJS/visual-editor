import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import getResponseError from '@/app/api/utils/getResponseError'
import sanitizeProjectData from '@/app/api/utils/sanitizeProjectData'
import supabaseClient from '@/app/api/supabaseClient'
import { updateProjectSchema } from '../../utils/projectSchema'

async function getProject(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return getResponseError('No id provided.')
  }

  const { data, error } = await supabaseClient
    .from('projects')
    .select()
    .eq('id', id)
    .eq('owner_id', session.userId)
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  return NextResponse.json(sanitizeProjectData(data), { status: 200 })
}

export const GET = withSession(getProject)

async function patchProject(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return getResponseError('No id provided.')
  }

  const requestPayload = await request.json()
  const { value: input, error: inputError } = updateProjectSchema.validate(requestPayload)

  if (inputError) {
    return getResponseError(inputError.message)
  }

  const { error } = await supabaseClient
    .from('projects')
    .update({
      ...input,
      last_updated: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('owner_id', session.userId)
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  return new Response(null, { status: 204 })
}

export const PATCH = withSession(patchProject)
