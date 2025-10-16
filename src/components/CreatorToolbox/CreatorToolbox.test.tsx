import { act, render, renderHook, screen } from '@testing-library/react'
import CreatorToolbox from './CreatorToolbox'
import useCreator from '@/hooks/useCreator/useCreator'
import { __triggerSelectAsset } from '@mateuszjs/magic-render'
import * as LoaderHarness from '@/components/OverlayLoader/harness'
import { getSanitizedProject } from '@/test/getSanitizedProject'

const project = getSanitizedProject()

let isMobile = false
jest.mock('@/hooks/useIsMobile/useIsMobile', () => () => isMobile)
const mobileButtons = ['Image', 'Shape', 'Text']
const desktopButtons = ['Select Object', 'Select Node', 'Draw Shape', 'Add Text', 'Upload Image']

describe('CreatorToolbox - creator not initialized yet', () => {
  it('for desktop', async () => {
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */
    expect(LoaderHarness.getLoader()).toBeInTheDocument()
  })

  it('for mobile', async () => {
    isMobile = true
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */
    expect(LoaderHarness.getLoader()).toBeInTheDocument()
  })
})

describe('CreatorToolbox - desktop', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(async () => {
      result.current.init(window.creatorCanvas, project)
    })
    isMobile = false
  })

  it('default state of toolbox', async () => {
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */

    expect(LoaderHarness.getLoader()).not.toBeInTheDocument()

    desktopButtons.forEach((tooltip) => {
      expect(screen.queryByRole('button', { description: tooltip })).toBeInTheDocument()
    })

    expect(screen.getByRole('navigation').children).toHaveLength(desktopButtons.length)
  })

  it('toolbox states in default state despite the selected asset', async () => {
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */
    await act(async () => {
      __triggerSelectAsset([1, 0, 0, 0])
    })

    expect(LoaderHarness.getLoader()).not.toBeInTheDocument()

    desktopButtons.forEach((tooltip) => {
      expect(screen.queryByRole('button', { description: tooltip })).toBeInTheDocument()
    })

    expect(screen.getByRole('navigation').children).toHaveLength(desktopButtons.length)
  })
})

describe('CreatorToolbox - mobile', () => {
  beforeEach(async () => {
    const { result } = renderHook(useCreator)
    await act(async () => {
      result.current.init(window.creatorCanvas, project)
    })
    isMobile = true
  })

  it('default state of toolbox', async () => {
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */

    expect(LoaderHarness.getLoader()).not.toBeInTheDocument()

    mobileButtons.forEach((name) => {
      expect(screen.queryByRole('button', { name })).toBeInTheDocument()
    })

    expect(screen.getByRole('navigation').children).toHaveLength(mobileButtons.length)
  })

  it('after selecting an asset', async () => {
    render(<CreatorToolbox />)
    await act(async () => {}) /* wait for lazy components */
    await act(async () => {
      __triggerSelectAsset([1, 0, 0, 0])
    })

    expect(screen.queryByRole('button', { name: 'Remove' })).toBeInTheDocument()
    expect(screen.getByRole('navigation').children).toHaveLength(1)
  })
})
