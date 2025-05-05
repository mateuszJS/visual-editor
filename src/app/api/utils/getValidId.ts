/** returns null if number is not valid */
export default async function getValidId(
  context: { params: Promise<Record<string, string>> },
  paramName: string
) {
  const params = await context.params
  const id = Number(params[paramName])

  if (!id || !Number.isInteger(Number(id)) || id <= 0) {
    return null
  }

  return id
}
