import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.PRIVATE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Supabase URL is missing in environment variables.')
}
if (!supabaseKey) {
  throw new Error('Supabase anon Key is missing in environment variables.')
}

const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)

export default supabaseClient
