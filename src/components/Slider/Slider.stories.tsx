import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import Slider from './Slider'
import { useArgs } from 'storybook/preview-api'

const meta = {
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ariaLabel: 'range',
    handles: [
      { label: 'Distance at which effect starts', value: 20 },
      { label: 'Distance at which effect ends', value: 80 },
    ],
    min: 0,
    max: 100,
    onChange: fn(),
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (index: number, newValue: number, commit: boolean) => {
      const handles = [...args.handles]
      handles[index] = { ...handles[index], value: newValue }
      args.onChange(handles, commit)
      updateArgs({ handles })
    }

    return (
      <div style={{ width: 200, padding: 50, background: '#444' }}>
        <Slider {...args} onChange={onChange}>
          <div
            style={{
              height: '0.3em',
              flexGrow: 1,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
            }}
          />
        </Slider>
      </div>
    )
  },
}
