import { useEffect } from 'react'

export function useOnKey(callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const abortCtrl = new AbortController()
    document.addEventListener(
      'keydown',
      (event) => {
        const isInputFocused =
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'

        if (isInputFocused) return

        callback(event)
      },
      abortCtrl
    )

    return () => abortCtrl.abort()
  }, [callback])
}
