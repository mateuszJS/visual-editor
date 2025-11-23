import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import RangeSlider from './RangeSlider'
import { useArgs } from 'storybook/preview-api'

const meta = {
  component: RangeSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ariaLabel: 'range',
    start: 10,
    end: 20,
    min: 0,
    max: 100,
    onChange: fn(),
  },
} satisfies Meta<typeof RangeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (start: number, end: number, commit: boolean) => {
      args.onChange(start, end, commit)
      updateArgs({ start, end })
    }

    return (
      <div style={{ width: 200, padding: 50, background: '#444' }}>
        <RangeSlider {...args} onChange={onChange} />
      </div>
    )
  },
}
