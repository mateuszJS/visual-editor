interface Env {
  production: D1Database
  SESSION_SECRET: string
  PUBLIC_GOOGLE_CLIENT_ID: string
}

declare module 'cloudflare:test' {
  interface ProvidedEnv extends Env {
    TEST_MIGRATIONS: D1Migration[] // Defined in `vitest.config.mts`
  }
}
