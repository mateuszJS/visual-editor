import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import { Outfit } from 'next/font/google'
import '../src/app/globals.css'
import './font-aliasing.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
  decorators: [
    (Story) => {
      document.body.classList.add(outfit.variable)
      return (
        <div id="non-modal-content">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
