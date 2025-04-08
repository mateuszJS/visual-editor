import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use the service role key for server-side operations

if (!supabaseUrl) {
  throw new Error('Supabase URL is missing in environment variables.')
}
if (!supabaseKey) {
  throw new Error('Supabase Service Role Key is missing in environment variables.')
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase
