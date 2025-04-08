import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
}

export default preview
