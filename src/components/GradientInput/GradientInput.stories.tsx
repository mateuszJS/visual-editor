import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import GradientInput from './GradientInput'
import { useArgs } from 'storybook/preview-api'
import { LinearGradient } from '@mateuszjs/magic-render/types'

const meta = {
  component: GradientInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: {
      start: { x: 0.1, y: 0.1 },
      end: { x: 0.9, y: 0.9 },
      stops: [
        { offset: 0, color: [1, 0, 0, 1] },
        { offset: 0.5, color: [0, 1, 0, 1] },
        { offset: 1, color: [0, 0, 1, 1] },
      ],
    } satisfies LinearGradient,
    onChange: fn(),
  },
} satisfies Meta<typeof GradientInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (value: LinearGradient, preview: boolean) => {
      args.onChange(value, preview)
      updateArgs({ value })
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
            justifyContent: 'flex-end',
          }}
        >
          <GradientInput {...args} onChange={onChange} />
        </div>
      </>
    )
  },
}
