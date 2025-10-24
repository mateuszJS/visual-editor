import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { playwright } from '@vitest/browser-playwright'
import svgr from 'vite-plugin-svgr'

/*
If you need to run some tests using Node-based runner, you can define a projects option
https://vitest.dev/guide/browser/
*/
export default defineConfig({
  define: {
    'process.env': {},
  },
  test: {
    projects: [
      {
        define: {
          'process.env': {},
        },
        plugins: [
          tsconfigPaths(),
          react(),
          svgr({
            include: '**/*.svg',
            svgrOptions: { icon: true },
            // svgrOptions: { plugins: ['@svgr/plugin-jsx'] },
          }),
        ],
        test: {
          // environment: 'jsdom',

          name: { label: 'components', color: 'magenta' },
          include: ['src/**/*.test.tsx'],
          browser: {
            enabled: true,
            provider: playwright(),
            // at least one instance is required
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['setup.ts'],
        },
      },
    ],
  },
})
