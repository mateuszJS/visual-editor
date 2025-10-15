import { screen, within } from '@testing-library/react'

export function getLoader(el?: HTMLElement) {
  const context = el ? within(el) : screen
  return context.queryByText(/loading/i)
}
