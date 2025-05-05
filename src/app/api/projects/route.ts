import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload, withSession } from '../wrappers/session'
import supabaseClient from '../supabaseClient'
import Joi from 'joi'
import getResponseError from '@/app/api/utils/getResponseError'
import sanitizeProjectData from '@/app/api/utils/sanitizeProjectData'

const schema = Joi.object<{ width: string; height: string; assets?: string[] }>({
  width: Joi.number().integer().min(1).max(3000).required(),
  height: Joi.number().integer().min(1).max(3000).required(),
  assets: Joi.array().optional(),
})

async function createProject(session: SessionPayload, request: NextRequest) {
  const requestPayload = await request.json()
  const { value: input, error: inputError } = schema.validate(requestPayload)

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

export const POST = withSession(createProject)
