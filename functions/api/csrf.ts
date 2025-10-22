import { randomBytes } from 'node:crypto'
import { serialize } from 'cookie'
// Currently we only use CSRF for vulnerable endpoints which does not require user's session cookie
// like login. The benefits of that is when user open the mobile app,
// we can faster fetch user data, instead of waiting for CSRF token to be download firstly

export const onRequestGet: Handler = () => {
  const csrfToken = randomBytes(32).toString('hex')

  console.log(typeof window)
  console.log('Verifying idToken:', crypto.subtle)
  console.log('Verifying idToken:', crypto.subtle.importKey)
  console.log('Verifying idToken:', crypto.subtle.verify)

  // const verifier = createVerify('RSA-SHA256')
  // console.log('Verifying idToken:', verifier)
  const res = Response.json({ csrfToken }, { status: 200 })

  const cookie = serialize('csrf-token', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/auth/login',
  })

  res.headers.append('Set-Cookie', cookie)

  return res
}
