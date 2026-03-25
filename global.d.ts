export {}

declare global {
  interface Window {
    creatorCanvas: HTMLCanvasElement
  }
}

declare module 'valtio' {
  export function useSnapshot<T>(proxyObject: T): T
  // valtio/useSnapshot returns Readonly types
  // it's annoying to always pass "Readonly" types around
  // so we override the type here to return writeable types
  // but in this project there should never be an object obtained from useSnapshot
  // that excepts to be mudated
}

// Once react supprots those attributes, remove this custom declaration
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/74680
declare module 'react' {
  interface ButtonHTMLAttributes {
    command?: string
    commandfor?: string
  }
}
