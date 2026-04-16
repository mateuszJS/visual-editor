import {
  cloudflareTest,
  readD1Migrations,
  buildPagesASSETSBinding,
} from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

export default defineConfig({
  test: {
    include: ['./functions/**/*.test.ts'],
    setupFiles: ['./functions/setup.ts'],
  },
  plugins: [
    tsconfigPaths({ root: './functions' }),
    cloudflareTest(async () => {
      // Read all migrations in the `migrations` directory
      const __dirname = import.meta.dirname
      const migrationsPath = path.join(__dirname, './migrations')
      const migrations = await readD1Migrations(migrationsPath)
      const assetsPath = path.join(__dirname, './out')

      return {
        // solution suggested by CLAUDE, I don't like having a copy of my config
        wrangler: { configPath: './wrangler.test.jsonc' },
        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
            SESSION_SECRET: 'test-session-secret',
            NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'test-google-client-id',
            CF_ACCESS_KEY_ID: 'test-cf-access-key-id',
            CF_R2_SECRET_ACCESS_KEY: 'test-cf-r2-secret-access-key',
          },
          serviceBindings: {
            // https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/#buildpagesassetsbindingassetspath
            ASSETS: await buildPagesASSETSBinding(assetsPath),
          },
        },
      }
    }),
  ],
})
