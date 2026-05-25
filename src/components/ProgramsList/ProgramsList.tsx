'use client'

import { useEffect, useRef, useState } from 'react'
import imagePanelStyles from '@/components/shared/imagePanel.module.css'
import styles from './ProgramsList.module.css'
import { Program, ProgramInputs, SoftVector4, Vector4 } from '@mateuszjs/magic-render/types'

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
      a_angle: [1.4826521374313906, 2.180203890593174, 3.075500207999294, 3.295124411240022],
      c_Color: [0.8588235294117647, 0, 0.4823529411764706, 1],
      d_distance: [null, 10, -10, null],
    },
  },
  {
    name: 'Glow',
    code: `
let dist = d_distance(s);
color = vec4f(0.5, 1, 0.5, dist);`,
    previewSrc: 'https://images.pexels.com/photos/13649223/pexels-photo-13649223.jpeg',
    inputs: {
      d_distance: [50, 0, 0, -50],
    },
  },
  {
    name: 'Shadow',
    code: `let fill = c_Color(s);
let dist = d_distance(s);
color = vec4f(fill.rgb, fill.a * dist);`,
    previewSrc: 'https://images.pexels.com/photos/6687532/pexels-photo-6687532.jpeg',
    inputs: {
      c_Color: [0.1, 0.1, 0.9, 1],
      d_distance: [0, 0, 0, -150],
    },
  },
  {
    name: "Fading Shape's Stroke",
    code: `let fill = c_Color(s);
let progress = t_progress(s);
let dist = d_distance(s);
color = vec4f(fill.rgb, fill.a * progress * dist);`,
    previewSrc: 'https://images.pexels.com/photos/32694153/pexels-photo-32694153.jpeg',
    inputs: {
      c_Color: [0.1, 0.1, 0.9, 1],
      d_distance: [20, 10, -10, -20],
    },
  },
]

interface Props {
  initial: {
    // this prop is captured only once, when component is rendered
    program: Program
    inputs: ProgramInputs['props']
  }
  onChange: (program: Program, inputs: ProgramInputs['props'], commit: boolean) => void
}

export function ProgramsList({ initial, onChange }: Props) {
  const [filter, setFilter] = useState('')
  const initialRef = useRef<Props['initial'] | null>(initial)

  const normalizedFilter = filter.trim().toLowerCase()
  const filteredPrograms = normalizedFilter
    ? PROGRAMS_LIST.filter((program) => program.name.toLowerCase().includes(normalizedFilter))
    : PROGRAMS_LIST

  useEffect(() => {
    return () => {
      if (initialRef.current) {
        onChange(initialRef.current.program, initialRef.current.inputs, false)
      }
    }
  }, [])

  return (
    <div className={styles.root}>
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
              // onMouseEnter={() => {
              //   console.log('new', program.inputs)
              //   onChange({ code: program.code }, program.inputs, false)
              // }}
              onClick={() => {
                initialRef.current = null
                onChange({ code: program.code }, program.inputs, true)
              }}
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
    </div>
  )
}
