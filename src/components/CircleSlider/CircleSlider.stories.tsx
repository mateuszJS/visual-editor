import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import CircleSlider from './CircleSlider'

const meta = {
  component: CircleSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ariaLabel: 'angle',
    handles: [
      { label: 'Start', value: 45 },
      { label: 'End', value: 200 },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof CircleSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (index: number, newValue: number, commit: boolean) => {
      const handles = [...args.handles]
      handles[index] = { ...handles[index], value: newValue }
      args.onChange(index, newValue, commit)
      updateArgs({ handles })
    }

    return (
      <div style={{ width: 200, padding: 50, background: '#444' }}>
        <CircleSlider {...args} onChange={onChange} />
      </div>
    )
  },
}
