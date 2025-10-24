import { vi } from 'vitest'

const nextRouterMock = vi.requireActual('next-router-mock') as typeof import('next-router-mock')

const { useRouter: useRouterMock } = nextRouterMock

const usePathname = vi.fn().mockImplementation(() => {
  const router = useRouterMock()
  return router.pathname
})

const useSearchParams = vi.fn().mockImplementation(() => {
  const router = useRouterMock()
  return new URLSearchParams(router.query as Record<string, string>)
})

const useRouter = vi.fn().mockImplementation(useRouterMock)

export { useRouter, usePathname, useSearchParams }
