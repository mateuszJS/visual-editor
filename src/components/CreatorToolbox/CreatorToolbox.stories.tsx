import type { Meta, StoryObj } from '@storybook/nextjs'
import CreatorToolbox from './CreatorToolbox'
import useCreator from '@/hooks/useCreator/useCreator'
import { useEffect } from 'react'
import { SanitizedProject } from '@/app/api/utils/sanitizeProjectData'
import { mocked } from 'storybook/test'
import initMagicRender from '@mateuszjs/magic-render'

const meta = {
  component: CreatorToolbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    initialized: false,
  },
  argTypes: { initialized: { control: 'boolean' } },
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
  destroy: () => {},
} as unknown as Awaited<ReturnType<typeof initMagicRender>>

export const Default: Story = {
  decorators: [
    (Story, { args }) => {
      const initialized = (args as { initialized: boolean }).initialized // Storybook does not recognize type of cusotm args
      const result = useCreator()

      useEffect(() => {
        if (initialized) {
          const canvas = document.createElement('canvas')
          canvas.style.display = 'none'
          document.body.appendChild(canvas)
          result.init(canvas, project)

          return () => {
            if (canvas.isConnected) {
              document.body.removeChild(canvas)
              result.destroy(canvas)
            }
          }
        }
      }, [initialized])

      return <Story />
    },
  ],
  beforeEach: async () => {
    mocked(initMagicRender).mockResolvedValue(initMagicRenderMock)
  },
}
