'use client'

import { useImperativeHandle, useRef, useState } from 'react'
import ActionSheets from '../ActionSheets/ActionSheets'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './ProgramsModal.module.css'
import { SoftVector4, Vector4 } from '@mateuszjs/magic-render/types'

interface PredefinedPrograms {
  name: string
  code: string
  previewSrc: string
  inputs: Record<string, SoftVector4 | Vector4>
}

const PROGRAMS_LIST: PredefinedPrograms[] = [
  {
    name: 'Ring',
    code: `let fill = c_Color(s);
let dist = d_distance(s);
let angle = a_angle(s);
color = vec4f(fill.rgb, fill.a * dist * angle);`,
    previewSrc: 'https://images.pexels.com/photos/13661207/pexels-photo-13661207.jpeg',
    inputs: {
      a_angle: [1.4826521374313906, 2.180203890593174, 9.075500207999294, 3.295124411240022],
      c_Color: [0.8588235294117647, 0.6980392156862745, 0.4823529411764706, 1],
      d_distance: [146.3096374772175, 26.587809997903776, -30.27368997139314, -149.97186576942573],
    },
  },
  {
    name: 'Glow',
    code: `
color = vec4f(0.5, 1, 0.5, 1);`,
    previewSrc: 'https://images.pexels.com/photos/13649223/pexels-photo-13649223.jpeg',
    inputs: {},
  },
  {
    name: 'Shadow',
    code: `let fill = c_Color(s);
let dist = d_distance(s);
color = vec4f(fill.rgb, fill.a * dist);`,
    previewSrc: 'https://images.pexels.com/photos/6687532/pexels-photo-6687532.jpeg',
    inputs: {
      c_Color: [0.1, 0.1, 0.1, 1],
      d_distance: [0, 0, 0, -150],
    },
  },
]

interface Props {
  onSelect: (code: string, inputs: Record<string, SoftVector4 | Vector4>) => void
  openModalRef: React.Ref<VoidFunction>
}

export function ProgramsModal({ onSelect, openModalRef }: Props) {
  const [filter, setFilter] = useState('')
  const dialogRef = useRef<{ open: VoidFunction; close: VoidFunction }>(null)

  const normalizedFilter = filter.trim().toLowerCase()
  const filteredPrograms = normalizedFilter
    ? PROGRAMS_LIST.filter((program) => program.name.toLowerCase().includes(normalizedFilter))
    : PROGRAMS_LIST

  useImperativeHandle(openModalRef, () => () => dialogRef.current?.open(), [])

  return (
    <ActionSheets title="Select a program" dialogRef={dialogRef}>
      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter programs"
        aria-label="Filter programs"
        className={styles.filter}
      />

      {/* {error && <ErrorReloadButton listName="your assets" />}
        <ul className={imagePanelStyles.list}>
          {loading || error
            ? Array.from({ length: 16 }, (_, index) => (
                <li
                  key={index}
                  className={cn(imagePanelStyles.skeleton, error && imagePanelStyles.errorSkeleton)}
                ></li>
              ))
            : Array.from(items).map(([, item]) => (
                <li
                  key={item.id}
                  className={imagePanelStyles.imagePanel}
                  style={
                    {
                      '--background-url': `url(/api/storage/${item.id}/preview)`,
                    } as React.CSSProperties
                  }
                >
 */}

      <ul className={imagePanelStyles.list}>
        {filteredPrograms.map((program) => (
          <li key={program.name}>
            <button
              type="button"
              onClick={() => onSelect(program.code, program.inputs)}
              className={imagePanelStyles.imagePanel}
              style={
                {
                  '--background-url': `url(${program.previewSrc})`,
                } as React.CSSProperties
              }
              aria-label={`Select ${program.name} program`}
            >
              <p className="mt-auto">{program.name}</p>
            </button>
          </li>
        ))}
      </ul>
    </ActionSheets>
  )
}
