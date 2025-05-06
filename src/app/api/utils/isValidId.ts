/** @returns null if number is not valid */
export default function isValidId(maybeId: string) {
  const id = Number(maybeId)
  return Number.isInteger(id) && id > 0
}
