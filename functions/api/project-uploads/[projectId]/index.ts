import { withSession } from '@/wrappers/session'
import withError from '@/utils/error'
import { v4 as uuid } from 'uuid'
import getResponseError from '@/utils/getResponseError'
import getUploadUrl from './getUploadUrl'

export const onRequestPut = withSession<'projectId'>(async (ctx, session) => {
  const { searchParams } = new URL(ctx.request.url)
  const uploadId = searchParams.get('uploadId') || uuid()
  const contentLength = Number(searchParams.get('contentLength'))

  const [url, err] = await withError(async () =>
    getUploadUrl(ctx, ctx.params.projectId as string, uploadId, contentLength, session.userId)
  )

  if (err) {
    console.error(err)
    return getResponseError('Failed to generate signed URL.', 403)
  }

  return Response.redirect(url, 308)
})

// url to test upload:
// curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"
