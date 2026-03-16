import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import CodeInput from './CodeInput'
import { useArgs } from 'storybook/preview-api'

const meta = {
  component: CodeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    value: `color=vec4f(
  abs(signed_distance*0.01),
  path_t%1,
  angle/6.24,
  1
);`,
    onChange: fn(),
  },
} satisfies Meta<typeof CodeInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs()

    const onChange = (value: string, preview: boolean) => {
      args.onChange(value, preview)
      updateArgs({ value })
    }

    return (
      <>
        <div
          style={{
            width: 450,
            height: 300,
            padding: 50,
            background: '#444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ height: 45, display: 'flex', justifyContent: 'stretch' }}>
            <CodeInput {...args} onChange={onChange} />
          </div>
        </div>
      </>
    )
  },
}
