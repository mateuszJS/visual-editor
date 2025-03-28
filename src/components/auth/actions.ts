'use server'

import { UserStore } from '@/hooks/useUserStore'
import { createSession, deleteSession } from '@/app/api/session'
import { OAuth2Client } from 'google-auth-library'
import { redirect } from 'next/navigation'

const client = new OAuth2Client()
export async function googleLogin(prevState: unknown, googleJwtToken: string) {
  try {
    // TODO: does it actually VERIFIED that token is produces by google??
    const ticket = await client.verifyIdToken({
      idToken: googleJwtToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    })
    const payload = ticket.getPayload()
    if (!payload) throw Error("Google google-auth-library didn't returned payload.")
    /*
    {
      sub: '454365436345', // (Subject) Claim - Users google internal id
      email: 'jonh.smith@gmail.com',
      email_verified: true,
      name: 'John Smith',
      picture: 'https://......',
      given_name: 'John',
      family_name: 'Smith',
      exp: 1738431159,
    }
    */

    await createSession(payload.sub)

    const userData: UserStore['user'] = {
      picture: payload.picture,
      firstName: payload.given_name,
      lastName: payload.family_name,
    }

    return { userData }
  } catch (error) {
    console.error(error)
    return {
      error: 'Something went wrong, please try later or use a different account/login method.',
    }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
