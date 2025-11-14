import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import NumberInput from './NumberInput'
import { useArgs } from 'storybook/preview-api'

const meta = {
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'X:',
    value: 10,
    unit: 'px',
    onChange: fn(),
  },
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (value: number) => {
      args.onChange(value)
      updateArgs({ value })
    }

    return (
      <div style={{ width: 200, padding: 50, background: '#444' }}>
        <NumberInput {...args} onChange={onChange} />
      </div>
    )
  },
}
