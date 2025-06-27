import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import ErrorToast from '@/components/ErrorToast/ErrorToast'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'ErrorToast',
  component: ErrorToast,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: { error: 'Someting went wrong, please try again', close: fn() },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorToast>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {}
