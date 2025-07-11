import type { Meta } from '@storybook/react'
import HomeIcon from 'assets/home-icon.svg'
import { fn } from '@storybook/test'
import NavButton from './NavButton'

const meta = {
  title: 'Navigation2/NavButton',
  component: NavButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { children: [<HomeIcon key="" />, 'Home'], onClick: fn() },
} satisfies Meta<typeof NavButton>

export default meta
