import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import { useArgs } from 'storybook/preview-api'
import Select, { SelectOption } from './Select'

const Swatch = ({ color }: { color: string }) => (
  <span
    style={{
      display: 'inline-block',
      width: 12,
      height: 12,
      borderRadius: 2,
      background: color,
    }}
  />
)

const options: Array<SelectOption> = [
  { value: 'red', label: 'Red', leading: <Swatch color="#e53935" /> },
  { value: 'green', label: 'Green', leading: <Swatch color="#43a047" /> },
  { value: 'blue', label: 'Blue', leading: <Swatch color="#1e88e5" /> },
  { value: 'yellow', label: 'Yellow', leading: <Swatch color="#fdd835" />, disabled: true },
  { value: 'no-leading', label: 'Option without leading node' },
]

const meta = {
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'Color:',
    value: 'red',
    options,
    onChange: fn(),
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (value: string) => {
      args.onChange(value)
      updateArgs({ value })
    }

    return (
      <div style={{ width: 240, padding: 50, background: '#444', color: '#fff' }}>
        <Select {...args} onChange={onChange} />
      </div>
    )
  },
}
