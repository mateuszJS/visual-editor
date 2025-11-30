import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/__mocks__/**'],
              message:
                'Importing from __mocks__ directories will create another module and import from there, not from the file with mock used by jest. Import directly from the file you are mocking.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'Use fetcher instead of native fetch.',
        },
        {
          selector: "CallExpression[callee.name='useParams']",
          message:
            "useParams won't work with exporting static files from Next.js. Instead use usePathname and split('/')",
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
    },
  }),
]

export default eslintConfig
