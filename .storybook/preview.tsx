import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../src/app/globals.css'
import React from 'react'

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
  decorators: [
    (Story) => (
      <div id="non-modal-content">
        <Story />
      </div>
    ),
  ],
}

export default preview
