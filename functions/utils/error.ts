type ErrorMsg = {
  message: string
}

export function isErrorWithMessage(error: unknown): error is ErrorMsg {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

export default async function withError<T>(
  fn: () => Promise<T> | T
): Promise<[T, null] | [null, ErrorMsg]> {
  try {
    const result = fn()
    return [result instanceof Promise ? await result : result, null]
  } catch (err) {
    console.error(err)
    return [null, isErrorWithMessage(err) ? err : { message: 'Unknown error' }]
  }
}
