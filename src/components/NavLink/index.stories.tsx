import type { Meta, StoryObj } from '@storybook/react'
import NavLink from '.'
import HomeIcon from 'assets/home-icon.svg'

const meta = {
  title: 'Navigation/NavLink',
  component: NavLink,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/home-active',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: 'home',
    children: [<HomeIcon key="" />, 'Homee'],
  },
}

export const Active: Story = {
  args: {
    href: '/home-active',
    children: [<HomeIcon key="" />, 'Home'],
  },
}
