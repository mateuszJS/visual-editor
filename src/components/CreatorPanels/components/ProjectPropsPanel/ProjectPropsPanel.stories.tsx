import type { Meta, StoryObj } from '@storybook/nextjs'
import ProjectPropsPanel from './ProjectPropsPanel'

const meta = {
  component: ProjectPropsPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProjectPropsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    return (
      <div style={{ width: 300, padding: 50, background: '#444' }}>
        <ProjectPropsPanel />
      </div>
    )
  },
}
