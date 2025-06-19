import type { Meta, StoryObj } from '@storybook/react'
import Navigation from '.'

const meta = {
  title: 'Navigation/Navigation',
  component: Navigation,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/explore',
      },
    },
    docs: {
      description: {
        component:
          'If an user object is provided by useUserStore hook, then "Login" link changes to "Profile".',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
