export default function mockNextContext<T>(params: T) {
  return {
    params: Promise.resolve(params),
  }
}
