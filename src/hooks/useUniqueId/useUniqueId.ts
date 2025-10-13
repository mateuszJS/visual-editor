import { useRef } from 'react'

let id = 0

export default function useUniqueId() {
  const generatedId = useRef(`id-${id++}`)
  return generatedId.current
}

/**
 * This function is for testing purposes only.
 * It resets the module-level counter to 0.
 */
export function _resetUniqueIdCounter() {
  id = 0
}
