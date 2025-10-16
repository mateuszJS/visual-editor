import { withSession } from '../wrappers/session'
import createProject from './createProject'
import getProjectsList from './getProjectsList'

export const POST = withSession(createProject)
export const GET = withSession(getProjectsList)
