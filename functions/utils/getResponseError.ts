export default function getResponseError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}
