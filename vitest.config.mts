import {
  defineWorkersConfig,
  readD1Migrations,
  buildPagesASSETSBinding,
} from '@cloudflare/vitest-pool-workers/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'

export default defineWorkersConfig(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, './migrations')
  const migrations = await readD1Migrations(migrationsPath)
  const assetsPath = path.join(__dirname, './out')

  return {
    plugins: [tsconfigPaths({ root: './functions' })],
    test: {
      // root: './functions', // avoid this, causes to create node_modules in ./functions
      include: ['./functions/**/*.test.ts'],
      setupFiles: ['./functions/setup.ts'],
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.jsonc' },
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
        },
      },
    },
  }
})
