import { act } from '@testing-library/react'
export * from 'valtio'
import type * as ValtioTypes from 'valtio'
import { deepClone } from 'valtio/utils'

const { proxy: actualProxy } = jest.requireActual<typeof ValtioTypes>('valtio')

// a variable to hold reset functions for all stores declared in the app
export const storeResets = new Set<{ actual: object; initial: object }>()

export const proxy = <T extends object>(state: T) => {
  const store = actualProxy<T>(state)
  const initial = deepClone(state)
  storeResets.add({ actual: store, initial })
  return store
}

// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResets.forEach(({ actual, initial }) => {
      Object.keys(actual).forEach((key) => {
        actual[key as keyof typeof actual] = deepClone(initial[key as keyof typeof initial])
      })
    })
  })
})
