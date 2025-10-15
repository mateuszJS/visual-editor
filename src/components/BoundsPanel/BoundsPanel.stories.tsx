import type { Meta, StoryObj } from '@storybook/nextjs'
import BoundsPanel from './BoundsPanel'

const meta = {
  component: BoundsPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BoundsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    return (
      <div style={{ width: 300, padding: 50, background: '#444' }}>
        <BoundsPanel />
      </div>
    )
  },
}
