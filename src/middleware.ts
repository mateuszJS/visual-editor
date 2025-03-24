import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/profile', '/me']
const guestRoutes = ['/login']

export default async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('session')?.value
  const session = await decrypt(cookie)

  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // TODO: move to separate api folder
  // or consider moving to server action! Double check if server action passes though middleway or bypass them
  if (path === '/me') {
    return NextResponse.json({
      picture: '',
      firstName: 'John',
      lastName: 'Doe',
    })
  }

  const guestRoute = guestRoutes.includes(path)
  if (guestRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
