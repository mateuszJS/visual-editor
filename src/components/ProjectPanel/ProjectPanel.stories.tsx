import type { Meta, StoryObj } from '@storybook/nextjs'
import ProjectPanel from './ProjectPanel'

const meta = {
  title: 'ProjectPanel',
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
  args: { id: '2', text: 'Project Name' },
} satisfies Meta<typeof ProjectPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
