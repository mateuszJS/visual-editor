import { NextRequest } from 'next/server'

type MockNextRequestOptions = {
  method?: string
  url?: string
  headers?: Record<string, string>
  cookies?: Record<string, string>
  body?: ReadableStream | null
  formData?: Record<string, string | File>
  geo?: {
    city?: string
    country?: string
    region?: string
  }
  ip?: string
  nextUrl?: URL
  userAgent?: string
}

/**
 * Creates a mock NextRequest object for testing
 *
 * @param options Configuration options for the mock request
 * @returns A mocked NextRequest object that can be used in tests
 *
 * @example
 * // Basic usage
 * const req = createMockNextRequest({
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' }
 * })
 *
 * // With form data
 * const req = createMockNextRequest({
 *   method: 'POST',
 *   formData: { email: 'test@example.com', name: 'Test User' }
 * })
 */
export default function createMockNextRequest(options: MockNextRequestOptions = {}): NextRequest {
  const {
    method = 'GET',
    url = 'https://example.com',
    headers = {},
    cookies = {},
    body = null,
    formData = {},
    geo = {},
    ip = '127.0.0.1',
    userAgent = 'Mozilla/5.0',
  } = options

  // Create URL object from string URL
  const urlObj = options.nextUrl || new URL(url)

  // Create headers object
  const headersObj = new Headers()
  // Add default headers
  headersObj.set('accept-language', 'en-US,en;q=0.9')
  headersObj.set('user-agent', userAgent)

  // Add custom headers
  Object.entries(headers).forEach(([key, value]) => {
    headersObj.set(key, value)
  })

  // Create mock cookies
  const cookiesObj = {
    get: jest.fn((name: string) => cookies[name]),
    getAll: jest.fn(() => Object.entries(cookies).map(([name, value]) => ({ name, value }))),
    has: jest.fn((name: string) => name in cookies),
    set: jest.fn(),
    delete: jest.fn(),
  }

  // Create mock formData method
  const formDataMethod = jest.fn().mockResolvedValue(
    Object.entries(formData).reduce((acc, [key, value]) => {
      acc.append(key, value)
      return acc
    }, new FormData())
  )

  // Create mock NextRequest
  const req = {
    body,
    cookies: cookiesObj,
    headers: headersObj,
    method,
    nextUrl: urlObj,
    url,
    formData: formDataMethod,
    geo,
    ip,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    blob: jest.fn().mockResolvedValue(new Blob()),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
  } as unknown as NextRequest

  return req
}
