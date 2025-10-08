import type { Meta, StoryObj } from '@storybook/nextjs'
import NavLink from './NavLink'
import HomeIcon from 'assets/home-icon.svg'

const meta = {
  title: 'Navigation/NavLink',
  component: NavLink,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/explore',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/creator',
    children: [<HomeIcon key="" />, 'Home'],
  },
}

export const Active: Story = {
  args: {
    href: '/explore',
    children: [<HomeIcon key="" />, 'Home'],
  },
}
