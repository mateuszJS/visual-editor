import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import GradientSlider from './GradientSlider'
import { GradientStop } from '@mateuszjs/magic-render/types'

const meta = {
  component: GradientSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    initialStops: [
      { offset: 0, color: [1, 0, 0, 1] },
      { offset: 0.5, color: [0, 1, 0, 1] },
      { offset: 1, color: [0, 0, 1, 1] },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof GradientSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const onChange = (stops: GradientStop[], preview: boolean) => {
      args.onChange(stops, preview)
    }

    return (
      <>
        <div
          style={{
            width: 350,
            height: 300,
            padding: 50,
            background: '#444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'stretch',
          }}
        >
          <GradientSlider {...args} onChange={onChange} />
        </div>
      </>
    )
  },
}
