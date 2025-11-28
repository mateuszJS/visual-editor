import useCreator from '@/hooks/useCreator/useCreator'
import { PointUV } from '@mateuszjs/magic-render/types'
import { useSnapshot } from 'valtio'
import NumberInput from '@/components/NumberInput/NumberInput'
import styles from './BoundsPanel.module.css'
import { assetState } from '@/stores/asset'

function getData(bounds: readonly PointUV[]) {
  const width = Math.hypot(bounds[0].x - bounds[1].x, bounds[0].y - bounds[1].y)
  const height = Math.hypot(bounds[0].x - bounds[3].x, bounds[0].y - bounds[3].y)
  const x = (bounds[0].x + bounds[2].x) / 2
  const y = (bounds[0].y + bounds[2].y) / 2
  return { width, height, x, y }
}

const PLACEHOLDER_DATA = { width: 0, height: 0, x: 0, y: 0 }

function getNewBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  angle: number
): PointUV[] {
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)
  const halfWidth = width / 2
  const halfHeight = height / 2

  return [
    {
      x: x - halfWidth * cos - halfHeight * sin,
      y: y - halfWidth * sin + halfHeight * cos,
      u: 0,
      v: 1,
    },
    {
      x: x + halfWidth * cos - halfHeight * sin,
      y: y + halfWidth * sin + halfHeight * cos,
      u: 1,
      v: 1,
    },
    {
      x: x + halfWidth * cos + halfHeight * sin,
      y: y + halfWidth * sin - halfHeight * cos,
      u: 1,
      v: 0,
    },
    {
      x: x - halfWidth * cos + halfHeight * sin,
      y: y - halfWidth * sin - halfHeight * cos,
      u: 0,
      v: 0,
    },
  ]
}

export default function BoundsPanel() {
  const { bounds } = useSnapshot(assetState)

  const creator = useCreator()
  const { width, height, x, y } = bounds ? getData(bounds) : PLACEHOLDER_DATA

  if (!bounds) {
    return null
  }

  function onChange(x: number, y: number, width: number, height: number, commit: boolean) {
    if (!bounds) throw new Error('No bounds')
    const angle = Math.atan2(bounds[1].y - bounds[0].y, bounds[1].x - bounds[0].x)
    const newBounds = getNewBounds(x, y, width, height, angle)
    creator.creator.updateAssetBounds(newBounds, commit)
  }

  return (
    <fieldset className={styles.root} disabled={!bounds}>
      <legend>Bounds</legend>
      <NumberInput
        label="X:"
        name="x"
        value={x}
        onChange={(value, commit) => onChange(value, y, width, height, commit)}
        unit="px"
      />
      <NumberInput
        label="Y:"
        name="y"
        value={y}
        onChange={(value, commit) => onChange(x, value, width, height, commit)}
        unit="px"
      />
      <NumberInput
        label="W:"
        name="width"
        value={width}
        onChange={(value, commit) => onChange(x, y, value, height, commit)}
        unit="px"
      />
      <NumberInput
        label="H:"
        name="height"
        value={height}
        onChange={(value, commit) => onChange(x, y, width, value, commit)}
        unit="px"
      />
    </fieldset>
  )
}
