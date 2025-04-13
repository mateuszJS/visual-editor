import { NextRequest } from 'next/server'
import { TokenPayload } from 'google-auth-library'
import getUserData from './getUserData'
import { getInitialDB, getMockDB } from '@/app/api/supabaseClient/__mocks__'
import * as nextServer from 'next/server'
import * as vercelFunctions from '@vercel/functions'
import createMockNextRequest from '@/app/api/test/mockNextRequest'

// jest.mock('@vercel/functions', () => ({
//   geolocation: jest.fn(),
// }))

// jest.mock('next/server', () => {
//   const originalModule = jest.requireActual('next/server')
//   return {
//     ...originalModule,
//     userAgent: jest.fn(),
//   }
// })

jest.mock('@/app/api/supabaseClient')

const request = createMockNextRequest({
  headers: {
    'accept-language': 'en-US,en;q=0.9',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  },
  geo: {
    country: 'US',
  },
})

const googleOidcPayload: TokenPayload = {
  email: 'test@example.com',
  sub: 'google-1',
  iss: '',
  aud: '',
  iat: 0,
  exp: 0,
}

describe('getUserData', () => {
  // test('should return existing user if found', async () => {
  //   const mockDB = getMockDB() // index = 0
  //   const result = await getUserData(googleOidcPayload, request)
  //   expect(result).toEqual({
  //     email: 'test@example.com',
  //     id: 'user-1',
  //     oidc_google_id: 'google-1',
  //   })
  //   const expectedDB = getInitialDB() // index = 1
  //   expect(mockDB).toEqual(expectedDB)
  // })

  test('if user doesn/t exists then adds that user to DB and returns it', async () => {
    const mockDB = getMockDB()
    console.log('before await')
    const result = await getUserData(
      {
        ...googleOidcPayload,
        sub: 'non-existing-google-id',
      },
      request
    )
    console.log('after await')
    console.log(getMockDB())
    const expectedUser = {
      avatar: null,
      browser: 'Chrome',
      browser_engine: 'Blink',
      country: null,
      device_model: null,
      device_type: null,
      email: 'test@example.com',
      id: 1,
      is_bot: false,
      language: 'en-US',
      login_method: 'google',
      name: null,
      oidc_google_id: 'non-existing-google-id',
      os: 'Windows',
    }
    expect(result).toEqual(expectedUser)

    const expectedDB = getInitialDB('arg')
    expectedDB.tables.users.push(expectedUser)
    console.log('right after push it shows one time??')
    console.log(getMockDB())
    expect(mockDB).toEqual(expectedDB)
  })

  // test('should create new user if not found', async () => {
  //   // Mock Supabase responses
  //   const mockNewUser = {
  //     id: 'new-user-123',
  //     email: 'test@example.com',
  //     oidc_google_id: 'google-123456',
  //   }

  //   // First call - no existing user
  //   jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
  //     if (table === 'users') {
  //       return {
  //         select: jest.fn().mockReturnValue({
  //           eq: jest.fn().mockResolvedValue({
  //             data: [],
  //             error: null,
  //           }),
  //         }),
  //         insert: jest.fn().mockReturnValue({
  //           select: jest.fn().mockReturnValue({
  //             single: jest.fn().mockResolvedValue({
  //               data: mockNewUser,
  //               error: null,
  //             }),
  //           }),
  //         }),
  //       } as unknown as MockSupabaseChain
  //     }
  //     return {} as unknown as MockSupabaseChain
  //   })

  //   const result = await getUserData(mockPayload, mockRequest)

  //   expect(supabase.from).toHaveBeenCalledWith('users')
  //   expect(result).toEqual(mockNewUser)
  // })

  // test('should throw error when failing to find existing user', async () => {
  //   // Mock Supabase error
  //   jest.spyOn(supabase, 'from').mockReturnValue({
  //     select: jest.fn().mockReturnValue({
  //       eq: jest.fn().mockResolvedValue({
  //         data: null,
  //         error: { message: 'Database error' },
  //       }),
  //     }),
  //   } as unknown as MockSupabaseChain)

  //   await expect(getUserData(mockPayload, mockRequest)).rejects.toThrow('Database error')
  // })

  // test('should throw error when email is missing', async () => {
  //   // Mock payload without email
  //   const incompletePayload = {
  //     ...mockPayload,
  //     email: undefined,
  //   } as unknown as TokenPayload

  //   // Mock no existing user
  //   jest.spyOn(supabase, 'from').mockReturnValue({
  //     select: jest.fn().mockReturnValue({
  //       eq: jest.fn().mockResolvedValue({
  //         data: [],
  //         error: null,
  //       }),
  //     }),
  //   } as unknown as MockSupabaseChain)

  //   await expect(getUserData(incompletePayload, mockRequest)).rejects.toThrow(
  //     'Email to sign in was not provided.'
  //   )
  // })

  // test('should throw error when user creation fails', async () => {
  //   // Mock Supabase responses
  //   jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
  //     if (table === 'users') {
  //       return {
  //         select: jest.fn().mockReturnValue({
  //           eq: jest.fn().mockResolvedValue({
  //             data: [],
  //             error: null,
  //           }),
  //         }),
  //         insert: jest.fn().mockReturnValue({
  //           select: jest.fn().mockReturnValue({
  //             single: jest.fn().mockResolvedValue({
  //               data: null,
  //               error: { message: 'Failed to create user in database' },
  //             }),
  //           }),
  //         }),
  //       } as unknown as MockSupabaseChain
  //     }
  //     return {} as unknown as MockSupabaseChain
  //   })

  //   await expect(getUserData(mockPayload, mockRequest)).rejects.toThrow(
  //     'Failed to create user in database'
  //   )
  // })

  // test('should create user with correct details', async () => {
  //   // Mock no existing user
  //   const insertMock = jest.fn().mockReturnValue({
  //     select: jest.fn().mockReturnValue({
  //       single: jest.fn().mockResolvedValue({
  //         data: { id: 'new-user-123' },
  //         error: null,
  //       }),
  //     }),
  //   })

  //   jest.spyOn(supabase, 'from').mockImplementation((table: string) => {
  //     if (table === 'users') {
  //       return {
  //         select: jest.fn().mockReturnValue({
  //           eq: jest.fn().mockResolvedValue({
  //             data: [],
  //             error: null,
  //           }),
  //         }),
  //         insert: insertMock,
  //       } as unknown as MockSupabaseChain
  //     }
  //     return {} as unknown as MockSupabaseChain
  //   })

  //   await getUserData(mockPayload, mockRequest)

  //   // Verify correct user details were passed to insert
  //   expect(insertMock).toHaveBeenCalledWith({
  //     email: 'test@example.com',
  //     name: 'Test User',
  //     avatar: 'https://example.com/avatar.jpg',
  //     language: 'en-US',
  //     country: 'US',
  //     browser: 'Chrome',
  //     device_type: 'desktop',
  //     device_model: '',
  //     browser_engine: 'Blink',
  //     os: 'macOS',
  //     is_bot: false,
  //     login_method: 'google',
  //     oidc_google_id: 'google-123456',
  //   })
  // })
})
