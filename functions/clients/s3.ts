import { S3Client } from '@aws-sdk/client-s3'

let client: S3Client | null = null

if (!process.env.CF_ACCOUNT_ID) {
  throw new Error('CF_ACCOUNT_ID is missing')
}

if (!process.env.CF_ACCESS_KEY_ID) {
  throw new Error('CF_ACCESS_KEY_ID is missing')
}

if (!process.env.CF_R2_SECRET_ACCESS_KEY) {
  throw new Error('CF_R2_SECRET_ACCESS_KEY is missing')
}

export default function getS3Client() {
  if (!client) {
    client = new S3Client({
      endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CF_ACCESS_KEY_ID,
        secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY,
      },
      region: 'auto',
    })
  }
  return client
}
