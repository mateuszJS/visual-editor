import { withSession } from '@/wrappers/session'
import withError from '@/utils/error'
import { v4 as uuid } from 'uuid'
import getResponseError from '@/utils/getResponseError'
import getUploadUrl from './getUploadUrl'

export const onRequestPut = withSession<'projectId'>(async (ctx, session) => {
  const contentLength = Number(ctx.request.headers.get('Content-Length'))

  const [url, err] = await withError(() =>
    getUploadUrl(ctx, ctx.params.projectId as string, uuid(), contentLength, session.userId, null)
  )

  if (err) {
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return Response.redirect(url, 307)
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"
