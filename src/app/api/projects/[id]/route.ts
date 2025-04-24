import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload, withSession } from '@/app/api/session'
import getResponseError from '@/app/api/utils/getResponseError'
import sanitizeProjectData from '@/app/api/utils/sanitizeProjectData'
import supabaseClient from '@/app/api/supabaseClient'

async function getProject(
  session: SessionPayload,
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const projectId = Number(id)

  if (!projectId || !Number.isInteger(Number(projectId))) {
    return getResponseError('Invalid project id.')
  }

  const { data, error } = await supabaseClient
    .from('projects')
    .select()
    .eq('id', projectId)
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  if (data.owner_id !== session.userId) {
    return getResponseError('User does not have access to this project.', 403)
  }

  return NextResponse.json(sanitizeProjectData(data), { status: 200 })
}

export const GET = withSession(getProject)
