import useLocalStorage from '@/hooks/useLocalStorage/useLocalStorage'
import styles from './PanelWrapper.module.css'
import { ToggleEventHandler } from 'react'

interface Props {
  id: keyof typeof panelIdToTitle
  children: React.ReactNode
}

const panelIdToTitle = {
  projectProps: 'Project Properties',
  bounds: 'Bounds',
  shapeProps: 'Shape Properties',
  typography: 'Typography',
} as const

export default function PanelWrapper({ id, children }: Props) {
  const [isOpen, setIsOpen] = useLocalStorage<boolean>(`panel-${id}-isOpen`, true)

  const onToggle: ToggleEventHandler<HTMLDetailsElement> = (e) => {
    const { open } = e.currentTarget
    if (open !== undefined) {
      setIsOpen(open)
    }
  }

  return (
    <details className={styles.details} open={isOpen} onToggle={onToggle}>
      <summary className={styles.summary}>
        <h3>{panelIdToTitle[id]}</h3>
        <span className={styles.arrow}></span>
      </summary>
      {children}
    </details>
  )
}
