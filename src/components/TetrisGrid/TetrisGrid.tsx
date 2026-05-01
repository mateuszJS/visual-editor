import { useEffect, useState } from 'react'
import styles from './TetrisGrid.module.css'

// prettier-ignore
const SHAPES: Record<string, [number, number][]> = {
  dot: [[0, 0]],
  square: [[0, 0], [0, 1], [1, 0], [1, 1]],
  'line-y2': [[0, 0], [0, 1]],
  'line-y3': [[0, 0], [0, 1], [0, 2]],
  'line-x2': [[0, 0], [1, 0]],
  'line-x3': [[0, 0], [1, 0], [2, 0]],
  'L-1-y3': [[0, 0], [0, 1], [0, 2], [1, 2]],
  'L-2-y3': [[1, 0], [1, 1], [1, 2], [0, 2]],
  'L-1-y2': [[0, 0], [0, 1], [1, 1]],
  'L-2-y2': [[1, 0], [1, 1], [0, 1]],
}

type Item = { background: string; previewShape: keyof typeof SHAPES; createdAt: number }

const items: Item[] = [
  { background: 'yellow', previewShape: 'L-1-y3', createdAt: 20 },
  { background: 'orange', previewShape: 'square', createdAt: 19 },
  { background: 'red', previewShape: 'line-y2', createdAt: 18 },
  { background: 'magenta', previewShape: 'L-2-y2', createdAt: 17 },
  { background: 'purple', previewShape: 'line-x2', createdAt: 16 },
  { background: 'blue', previewShape: 'line-x3', createdAt: 15 },
  { background: 'cyan', previewShape: 'line-x2', createdAt: 14 },
  { background: 'lime', previewShape: 'L-2-y2', createdAt: 13 },
  { background: 'green', previewShape: 'L-1-y3', createdAt: 12 },
  { background: 'yellow', previewShape: 'line-x2', createdAt: 11 },
  { background: 'orange', previewShape: 'line-y3', createdAt: 10 },
  { background: 'red', previewShape: 'square', createdAt: 9 },
  { background: 'magenta', previewShape: 'line-x3', createdAt: 8 },
  { background: 'white', previewShape: 'line-y2', createdAt: 7 },
  { background: 'tomato', previewShape: 'dot', createdAt: 6 },
]

function reflectShape(coords: [number, number][], axis: 'x' | 'y' | 'both') {
  const maxX = Math.max(...coords.map((c) => c[0]))
  const maxY = Math.max(...coords.map((c) => c[1]))
  return coords.map(([x, y]) => {
    if (axis === 'x') return [maxX - x, y]
    if (axis === 'y') return [x, maxY - y]
    return [maxX - x, maxY - y]
  }) as [number, number][]
}

type PlacedShape = Item & {
  x: number
  y: number
  width: number
  height: number
  variantClass: string
}

export function TetrisGrid() {
  const [tetris, setTetris] = useState<PlacedShape[]>([])
  const [cols, setCols] = useState(3)

  useEffect(() => {
    function calculateTetrisLayout(gridWidth = 3) {
      const occupied = new Set()
      const finalItems: PlacedShape[] = []
      const sortedItems = [...items].sort((a, b) => b.createdAt - a.createdAt)

      sortedItems.forEach((item) => {
        const baseCoords = SHAPES[item.previewShape]
        let placed = false
        let y = 0

        // Define specific variant names to match your CSS classes
        const baseName = item.previewShape.replaceAll('-', '_')

        while (!placed) {
          for (let x = 0; x < gridWidth; x++) {
            const variations = item.previewShape.startsWith('L-')
              ? [
                  { coords: baseCoords, suffix: '' },
                  { coords: reflectShape(baseCoords, 'x'), suffix: '_reflected_x' },
                  { coords: reflectShape(baseCoords, 'y'), suffix: '_reflected_y' },
                  { coords: reflectShape(baseCoords, 'both'), suffix: '_reflected_both' },
                ]
              : [{ coords: baseCoords, suffix: '' }]

            for (const variant of variations) {
              const fits = variant.coords.every(([ox, oy]) => {
                const tx = x + ox
                const ty = y + oy
                return tx >= 0 && tx < gridWidth && !occupied.has(`${tx},${ty}`)
              })

              if (fits) {
                variant.coords.forEach(([ox, oy]) => occupied.add(`${x + ox},${y + oy}`))
                finalItems.push({
                  ...item,
                  x,
                  y,
                  width: Math.max(...variant.coords.map((c) => c[0])) + 1,
                  height: Math.max(...variant.coords.map((c) => c[1])) + 1,
                  variantClass: `shape_${baseName}${variant.suffix}`,
                })
                placed = true
                break
              }
            }
            if (placed) break
          }
          y++
          if (y > 1000) break
        }
      })
      setTetris(finalItems)
    }

    window.addEventListener('resize', () => {
      const newCols = Math.round(window.innerWidth / 100)
      // setCols(newCols)
      // calculateTetrisLayout(newCols)
    })
    calculateTetrisLayout(3)
  }, [])

  return (
    <div className={styles.gridContainer} style={{ '--cols': cols } as React.CSSProperties}>
      {tetris.map((item, index) => {
        // Use the dynamic variantClass to pull from the CSS Module

        const shapeClass = styles[item.variantClass] || ''

        return (
          <div
            key={`${item.createdAt}-${index}`}
            className={`${styles.gridItem} ${shapeClass}`}
            style={{
              gridColumnStart: item.x + 1,
              gridRowStart: item.y + 1,
              gridColumnEnd: `span ${item.width}`,
              gridRowEnd: `span ${item.height}`,
              // backgroundImage: `url(https://picsum.photos/200)`,
              backgroundColor: item.background,
              aspectRatio: `calc(
                calc((${item.width} * 100px) + (${item.width - 1} * var(--gap)))
                / 
                calc((${item.height} * 100px) + (${item.height - 1} * var(--gap)))
            )`,
            }}
          >
            {/* Optional: label for debugging */}
            <span style={{ fontSize: '10px', color: 'black' }}>{item.previewShape}</span>
          </div>
        )
      })}
    </div>
  )
}
