import type { Meta, StoryObj } from '@storybook/nextjs'
import ProjectPanel from './ProjectPanel'

const meta = {
  component: ProjectPanel,
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { id: '2', updatedAt: '2026-04-21T12:49:14.459Z' },
} satisfies Meta<typeof ProjectPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
