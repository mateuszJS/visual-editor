This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Installing dependencies:

```bash
npm i
```

To start development you need two terminals:

1. One to start Next.js app

```bash
   npm run dev
```

2. Second for Cloudflare functions:

```bash
npm run cf-dev-http
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing:

Before perofrmign visual regrerssion test, build a storybook with:
`npm run build-storybook`

All tests are run with:
`npm run test`

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
`sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" certificates/localhost.crt`

To generate certificate on MacOS run

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
 -newkey rsa:2048 -nodes -sha256 \
 -subj '/CN=localhost' -extensions EXT -config <( \
 printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

```

and move output files to `certificates` folder.
You might need to close the browser application and reopen to refresh ssl certificates.

##Migrations
to start: `npx wrangler d1 migrations create preview <migration brief description>`

to apply:
`npx wrangler d1 migrations apply preview --local`
`npx wrangler d1 migrations apply preview --remote`
`npx wrangler d1 migrations apply production --remote --env=production`

##CF R2
`wrangler r2 bucket create your-bucket-name`
url to test upload:
`curl --request PUT "<URL>" --header "Content-Type: text/plain" --header "Content-Length: 10" --data "nagvsudXgvakgabdgdkfaxsuieg"`
