import type { Meta, StoryObj } from '@storybook/nextjs'
import TypographyPanel from './TypographyPanel'

const meta = {
  component: TypographyPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    return (
      <div style={{ width: 300, padding: 50, background: '#444' }}>
        <TypographyPanel />
      </div>
    )
  },
}
