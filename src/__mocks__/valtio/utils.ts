import type * as ValtioUtils from 'valtio/utils'
import { act } from '@testing-library/react'
export * from 'valtio/utils'

const { proxyMap: actualProxyMap, proxySet: actualProxySet } =
  jest.requireActual<typeof ValtioUtils>('valtio/utils')

// a variable to hold reset functions for all stores declared in the app
export const storeMapsResets = new Set<{
  actual: ReturnType<typeof actualProxyMap>
  initial: Map<unknown, unknown> | undefined | null
}>()

// a variable to hold reset functions for all stores declared in the app
export const storeSetsResets = new Set<{
  actual: ReturnType<typeof actualProxySet>
  initial: Set<unknown> | undefined | null
}>()

export const proxyMap = <K, V>(entries?: Iterable<[K, V]> | undefined | null) => {
  const initial = typeof entries === 'object' ? new Map(entries) : entries

  const store = actualProxyMap<K, V>(entries)
  storeMapsResets.add({ actual: store, initial })
  return store
}

export const proxySet = <T>(entries?: Iterable<T> | undefined | null) => {
  const initial = typeof entries === 'object' ? new Set(entries) : entries

  const store = actualProxySet<T>(entries)
  storeSetsResets.add({ actual: store, initial })
  return store
}

// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeMapsResets.forEach(({ actual, initial }) => {
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

    storeSetsResets.forEach(({ actual, initial }) => {
      // Remove all existing keys from actual
      actual.keys().forEach((key) => {
        actual.delete(key)
      })

      if (initial) {
        initial.forEach((value) => {
          actual.add(value)
        })
      }
    })
  })
})
