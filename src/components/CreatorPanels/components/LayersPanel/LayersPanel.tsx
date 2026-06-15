'use client'

import cn from 'classnames'
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'
import type { Asset } from '@mateuszjs/magic-render/types'
import PictureIcon from 'assets/picture-icon.svg'
import TextIcon from 'assets/text-icon.svg'
import PenIcon from 'assets/pen-icon.svg'
import PanelWrapper from '../PanelWrapper/PanelWrapper'
import styles from './LayersPanel.module.css'
import useCreator from '@/hooks/useCreator/useCreator'

type LayerType = 'image' | 'text' | 'shape'

function getLayerType(asset: Asset): LayerType {
  if ('url' in asset) return 'image'
  if ('typo_props' in asset) return 'text'
  return 'shape'
}

const TYPE_LABEL: Record<LayerType, string> = {
  image: 'Image',
  text: 'Text',
  shape: 'Shape',
}

function LayerIcon({ type }: { type: LayerType }) {
  if (type === 'image') return <PictureIcon />
  if (type === 'text') return <TextIcon />
  return <PenIcon />
}

interface LayerItemProps {
  id: number
  type: LayerType
  selected: boolean
  index: number
  onHover: (id: number) => void
  onSelect: (id: number) => void
}

function SortableLayerItem({ id, type, selected, index, onHover, onSelect }: LayerItemProps) {
  const { ref, isDragging } = useSortable({ id, index })

  return (
    <li
      ref={ref}
      className={cn(styles.item, {
        [styles.selected]: selected,
        [styles.dragging]: isDragging,
      })}
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(0)}
      // {...attributes}
      // {...listeners}
    >
      <span className={styles.icon} aria-hidden="true">
        <LayerIcon type={type} />
      </span>
      <span className={styles.name}>
        {TYPE_LABEL[type]} #{id}
      </span>
    </li>
  )
}

export default function LayersPanel() {
  const creator = useCreator()

  if (
    !creator.isReady ||
    creator.assets.length === 0 ||
    creator.assets.filter((a) => a.id === undefined).length > 0
  ) {
    return null
  }

  const assets = creator.assets.toReversed() as Array<Omit<Asset, 'id'> & { id: number }>

  function handleDragEnd(event: DragEndEvent) {
    const newAssets = move(assets, event)
    creator.reorderAssets(newAssets.toReversed() as Asset[])
  }

  return (
    <PanelWrapper id="layers">
      <DragDropProvider onDragEnd={handleDragEnd}>
        <ul className={styles.root}>
          {assets.map((asset, index) => {
            const id = asset.id as number
            return (
              <SortableLayerItem
                key={id}
                id={id}
                index={index}
                type={getLayerType(asset as Asset)}
                selected={creator.selectedAssetId === id}
                onSelect={creator.creator.selectAsset}
                onHover={creator.creator.hoverAsset}
              />
            )
          })}
        </ul>
      </DragDropProvider>
    </PanelWrapper>
  )
}
