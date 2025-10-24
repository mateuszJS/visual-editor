import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'
import path from 'node:path'

export default defineWorkersConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, '../migrations')
  const migrations = await readD1Migrations(migrationsPath)

  return {
    test: {
      include: ['./**/*.spec.ts'],
      env: {
        SESSION_SECRET: 'test-session-secret',
        PUBLIC_GOOGLE_CLIENT_ID: 'test-google-client-id',
      },
      setupFiles: ['./setup.ts'],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: '../wrangler.jsonc',
            environment: 'production',
          },
          miniflare: {
            compatibilityDate: '2024-06-01',
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  }
})
