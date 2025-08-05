import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload } from '../wrappers/session'
import supabaseClient from '../supabaseClient'
import getResponseError from '@/app/api/utils/getResponseError'
import sanitizeProjectData from '@/app/api/utils/sanitizeProjectData'
import { createProjectSchema } from '../utils/projectSchema'

export default async function createProject(session: SessionPayload, request: NextRequest) {
  const requestPayload = await request.json()
  const { value: input, error: inputError } = createProjectSchema.validate(requestPayload)

  if (inputError) {
    return getResponseError(inputError.message)
  }

  const { data, error } = await supabaseClient
    .from('projects')
    .insert({
      width: Number(input.width),
      height: Number(input.height),
      owner_id: session.userId,
    })
    .select()
    .single()

  if (error) {
    return getResponseError(error.message)
  }

  return NextResponse.json(sanitizeProjectData(data), { status: 201 })
}
