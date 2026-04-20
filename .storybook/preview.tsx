import type { Preview } from '@storybook/nextjs'
import { sb } from 'storybook/test'
import { themes } from 'storybook/theming'
import localFont from 'next/font/local'
import '../src/app/order.css'
import '../src/app/reset.css'
import '../src/app/spaces.css'
import '../src/app/theme.css'
import '../src/app/utilities.css'
import '../src/app/components.css'
import '../src/app/elements.css'

const outfit = localFont({
  src: '../local-outfit.woff2',
  variable: '--font-outfit',
})

sb.mock(import('@mateuszjs/magic-render'))

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      document.body.classList.add(outfit.variable)
      return <Story />
    },
  ],
}

export default preview
