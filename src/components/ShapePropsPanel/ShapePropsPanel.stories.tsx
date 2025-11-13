import type { Meta, StoryObj } from '@storybook/nextjs'
import ShapePropsPanel from './ShapePropsPanel'

const meta = {
  component: ShapePropsPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ShapePropsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    return (
      <div style={{ width: 300, padding: 50, background: '#444' }}>
        <ShapePropsPanel />
      </div>
    )
  },
}
