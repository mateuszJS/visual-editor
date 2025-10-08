import type { Meta, StoryObj } from '@storybook/nextjs'
import CreatorToolbox from './CreatorToolbox'
import useCreator from '@/hooks/useCreator/useCreator'
import { useEffect } from 'react'
import { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { mocked } from 'storybook/test'
import initMagicRender from '@mateuszjs/magic-render'

const meta = {
  title: 'CreatorToolbox',
  component: CreatorToolbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreatorToolbox>

export default meta
type Story = StoryObj<typeof meta>

const project: SanitizedProject = {
  id: '1',
  width: 100,
  height: 100,
  assets: [],
  name: '',
  owner_id: '',
  last_updated: new Date().toISOString(),
}

const initMagicRenderMock = {
  resetAssets: () => {},
} as unknown as Awaited<ReturnType<typeof initMagicRender>>

export const Loading: Story = {}

export const Default: Story = {
  decorators: [
    (Story) => {
      const { init } = useCreator()

      useEffect(() => {
        const canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        init(canvas, project)
      }, [])

      return <Story />
    },
  ],
  beforeEach: async () => {
    mocked(initMagicRender).mockResolvedValue(initMagicRenderMock)
  },
}
