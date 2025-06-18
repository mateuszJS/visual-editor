import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/wrappers/session'
import getResponseError from '@/app/api/utils/getResponseError'
import sanitizeProjectData from '@/app/api/utils/sanitizeProjectData'
import supabaseClient from '@/app/api/supabaseClient'
import isValidId from '../../utils/isValidId'
import { updateProjectSchema } from '../../utils/projectSchema'

async function getProject(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!isValidId(id)) {
    return getResponseError('Invalid project id.')
  }

  const projectId = Number(id)
  const { data, error } = await supabaseClient
    .from('projects')
    .select()
    .eq('id', projectId)
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

  if (!isValidId(id)) {
    return getResponseError('Invalid project id.')
  }

  const requestPayload = await request.json()
  const { value: input, error: inputError } = updateProjectSchema.validate(requestPayload)

  if (inputError) {
    return getResponseError(inputError.message)
  }

  const projectId = Number(id)
  const { error } = await supabaseClient
    .from('projects')
    .update(input)
    .eq('id', projectId)
    .eq('owner_id', session.userId)
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  return new Response(null, { status: 204 })
}

export const PATCH = withSession(patchProject)
