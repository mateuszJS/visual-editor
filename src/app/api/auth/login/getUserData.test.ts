import { TokenPayload } from 'google-auth-library'
import getUserData from './getUserData'
import { __getCleanDBMock, dbMock, __setErrorQueue } from '@/app/api/supabaseClient'
import createMockNextRequest from '@/app/api/test/mockNextRequest'

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
  test('should return existing user if found', async () => {
    const result = await getUserData(googleOidcPayload, request)
    expect(result).toEqual({
      oidc_google_id: 'google-1',
      email: 'first-user@example.com',
      avatar: 'https://example.com/avatar.jpg',
      browser: 'Firefox',
      browser_engine: 'Gecko',
      country: 'JP',
      device_model: 'Macintosh',
      device_type: null,
      id: 0,
      is_bot: false,
      language: 'en-US',
      login_method: 'google',
      name: null,
      os: 'Mac OS',
    })
    const expectedDB = __getCleanDBMock()
    expect(dbMock).toEqual(expectedDB)
  })

  test('if user doesn/t exists then adds that user to DB and returns it', async () => {
    const result = await getUserData(
      {
        ...googleOidcPayload,
        sub: 'non-existing-google-id',
      },
      request
    )

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

    const expectedDB = __getCleanDBMock()
    expectedDB.tables.users.push(expectedUser)
    expect(dbMock).toEqual(expectedDB)
  })

  test('propagates error occured during search for existign user', async () => {
    __setErrorQueue([new Error('Error during search for existing user')])

    await expect(getUserData(googleOidcPayload, request)).rejects.toThrow(
      'Error during search for existing user'
    )
  })

  test('propagates error occured during creation of a new user', async () => {
    __setErrorQueue([null, new Error('Error during creating of a new user')])
    const nonExistingUser = {
      ...googleOidcPayload,
      sub: 'non-existing-google-id',
    }

    await expect(getUserData(nonExistingUser, request)).rejects.toThrow(
      'Error during creating of a new user'
    )
  })
})
