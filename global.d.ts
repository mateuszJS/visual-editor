export {}

declare global {
  interface Window {
    creatorCanvas: HTMLCanvasElement
  }
}

// type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

declare module 'valtio' {
  export function useSnapshot<T>(proxyObject: T): T
  // it's annoying to always pass "Readonly" types around
  // so we override the type here to return writeable types
  // but in this project there should never be a object obtained from useSnapshot
  // that excepts to be mudated
}
