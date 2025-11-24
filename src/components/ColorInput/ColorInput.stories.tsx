import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import ColorInput from './ColorInput'
import { useArgs } from 'storybook/preview-api'
import { Color } from '@mateuszjs/magic-render'

const meta = {
  component: ColorInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'fill color',
    value: [1, 1, 1, 1],
    onChange: fn(),
  },
} satisfies Meta<typeof ColorInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (value: Color, preview: boolean) => {
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
          <ColorInput {...args} onChange={onChange} />
        </div>
      </>
    )
  },
}
