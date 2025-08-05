import { withSession } from 'app/api/wrappers/session'
import downloadMiniature from './downloadMiniature'
import uploadMiniature from './uploadMiniature'

export const GET = withSession(downloadMiniature)
export const POST = withSession(uploadMiniature)
