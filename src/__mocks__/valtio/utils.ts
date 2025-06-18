import type * as ValtioUtils from 'valtio/utils'
import { act } from '@testing-library/react'
export * from 'valtio/utils'

const { proxyMap: actualProxyMap } = jest.requireActual<typeof ValtioUtils>('valtio/utils')

// a variable to hold reset functions for all stores declared in the app
export const storeResets = new Set<{
  actual: ReturnType<typeof actualProxyMap>
  initial: Map<unknown, unknown> | undefined | null
}>()

export const proxyMap = <K, V>(entries?: Iterable<[K, V]> | undefined | null) => {
  const initial = typeof entries === 'object' ? new Map(entries) : entries

  const store = actualProxyMap<K, V>(entries)
  storeResets.add({ actual: store, initial })
  return store
}

// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResets.forEach(({ actual, initial }) => {
      // Remove all existing keys from actual
      actual.keys().forEach((key) => {
        actual.delete(key)
      })

      if (initial) {
        initial.forEach((value, key) => {
          actual.set(key, value)
        })
      }
    })
  })
})
