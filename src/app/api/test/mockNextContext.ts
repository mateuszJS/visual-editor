export default function mockNextContext<T>(params: T = {} as T) {
  return {
    params: Promise.resolve(params),
  }
}
