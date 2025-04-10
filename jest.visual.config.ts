import { config as jestConfig } from './jest.config'

const config = {
  preset: 'jest-puppeteer',
  moduleNameMapper: jestConfig.moduleNameMapper,
  testMatch: ['**/*.visual-test.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

export default config
