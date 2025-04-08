import 'server-only'
import { NextResponse } from 'next/server'
import { withSession } from '@/app/api/session'
// import supabase from '@/utils/supabaseClient';

async function getUser() {
  // const { data: instruments } = await supabase.from("instruments").select();

  return NextResponse.json({
    picture: 'pic',
    firstName: 'John',
    lastName: 'Smith',
  })
}

export const GET = withSession(getUser)
