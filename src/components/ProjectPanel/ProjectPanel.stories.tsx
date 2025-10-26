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
  args: { id: '2', text: 'Loremus impsomemus YEAH!' },
} satisfies Meta<typeof ProjectPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
