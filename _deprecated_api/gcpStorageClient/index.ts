import { Storage } from '@google-cloud/storage'

if (!process.env.GOOGLE_STORAGE_PROJECT_ID) {
  throw new Error('Missing GOOGLE_STORAGE_PROJECT_ID env variable.')
}
if (!process.env.GOOGLE_STORAGE_EMAIL) {
  throw new Error('Missing GOOGLE_STORAGE_EMAIL env variable.')
}
if (!process.env.GOOGLE_STORAGE_PRIVATE_KEY) {
  throw new Error('Missing GOOGLE_STORAGE_PRIVATE_KEY env variable.')
}

// Creates a client
// https://cloud.google.com/nodejs/docs/reference/storage/latest
const storage = new Storage({
  projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_STORAGE_EMAIL,
    private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
})

export default storage
