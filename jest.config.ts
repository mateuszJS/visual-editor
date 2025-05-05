import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const buildConfig = async (config: Config): Promise<Config> => {
  return await createJestConfig(config)()
}

const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^assets/(.*)$': '<rootDir>/public/$1',
  '^test/(.*)$': '<rootDir>/test/$1',
  '^.+\\.(svg)$': '<rootDir>/src/__mocks__/svg.tsx',
}

export default async (): Promise<Config> => {
  const frontendConfig = await buildConfig({
    displayName: 'Frontend',
    testEnvironment: 'jest-fixed-jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
    testPathIgnorePatterns: ['/src/app/api/.*test\\.ts$'],
    moduleNameMapper,
  })

  const backendConfig = await buildConfig({
    displayName: 'Backend',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/app/api/**/*.test.ts'],
    moduleNameMapper,
    fakeTimers: {
      enableGlobally: true,
      now: new Date('2024-01-01').getTime(),
    },
  })

  const visualRegressionConfig: Config = {
    displayName: 'Visual Regression',
    preset: 'jest-puppeteer',
    testMatch: ['**/*.visual-test.{js,jsx,ts,tsx}'],
    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          useESM: true,
        },
      ],
    } as unknown as Config['transform'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper,
  }

  const config: Config = {
    // All imported modules in your tests should be mocked automatically
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    projects: [frontendConfig, backendConfig, visualRegressionConfig],
  }

  return config
}
