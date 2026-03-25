export class ErrorMsg extends Error {
  safeMsg: string // a safe message to show to users
  // so dones't include sensitive information and is user-friendly

  constructor(msg: string) {
    super(msg)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ErrorMsg.prototype)
    this.safeMsg = msg
  }
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
): Promise<[T, null] | [null, Error | ErrorMsg]> {
  try {
    const result = fn()
    return [result instanceof Promise ? await result : result, null]
  } catch (err) {
    // console.error(err) capture this log in the future
    return [null, err instanceof Error ? err : new ErrorMsg('Unknown error')]
  }
}
