This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Start development

1. ```bash
   npm i
   ```
2. Start docker
3. ```bash
   supabase start
   ```

4. Visit `localhost:3000

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

```

D1

`npx wrangler d1 migrations apply <DATABASE_NAME> [OPTIONS]
npx wrangler d1 migrations apply preview --local
npx wrangler d1 migrations apply preview --remote
npx wrangler d1 migrations apply production --remote --env=production`

To preview current schema: `SELECT name, sql FROM sqlite_master`
`npx wrangler d1 execute preview --local --command="SELECT name, sql FROM sqlite_master"`

Preview is used by everything except your local env and prod, so develop and all other branches.

to test:
`npx wrangler d1 execute production --local --command="SELECT * FROM users"`

For local development add SSL certificate(you will get issue in the browser regarding insecure connection):
`sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" certificates/localhost.pem`
Certificate should be generated after in `./certificates` directory after first run on `npm run dev` - wrangler dev with https flag
You might need to close the browser application and reopen to refresh ssl certificates.

##CF R2
`wrangler r2 bucket create your-bucket-name`

Connet bucke to a custom domain that is already managed by cloudflare:
https://developers.cloudflare.com/r2/buckets/public-buckets/#connect-a-bucket-to-a-custom-domain

Expose the contents of this R2 bucket to the internet through a Cloudflare-managed r2.dev subdomain. This endpoint is intended for non-production traffic.

Public access through r2.dev subdomains are rate limited and should only be used for development purposes.

Enabling public deployment url:
https://developers.cloudflare.com/r2/buckets/public-buckets/#enable-public-development-url

Presigned URL
https://developers.cloudflare.com/r2/buckets/cors/#create-a-presigned-url
