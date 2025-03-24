import {config as jestConfig} from './jest.config'

const config = {
  preset: 'jest-puppeteer',
  moduleNameMapper: jestConfig.moduleNameMapper,
  // not needed for now, but might be useufl in the future if we provide mroe custom setup
  testMatch: ['**/*.visual-test.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

export default config;