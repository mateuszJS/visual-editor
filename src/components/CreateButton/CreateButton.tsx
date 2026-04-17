import PlusIcon from 'assets/plus-icon.svg'
import { lazy, Suspense, useEffect, useRef } from 'react'
import Button from '@/components/Button/Button'
import styles from './CreateButton.module.css'
import cn from 'classnames'

const TRANSITION_DURATION_MS = 2000

const NewProjectModal = lazy(() => import('@/components/NewProjectModal/NewProjectModal'))

function getRandomTransform(scale: number) {
  const x = (Math.random() * 100 - 50) * scale
  const y = (Math.random() * 100 - 50) * scale

  return `translate: ${x}% ${y}%;`
}

export default function CreateButton() {
  const refCyan = useRef<HTMLDivElement>(null)
  const refMagenta = useRef<HTMLDivElement>(null)
  const refOrange = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('@/components/NewProjectModal/NewProjectModal')

    const key = 'NODE_ENV' // bypass for screenshot testing
    if (process.env[key] === 'test') return // to avoid random animation diff

    const updatePosition = () => {
      console.log('update position')
      refCyan.current!.style = getRandomTransform(1.7)
      refMagenta.current!.style = getRandomTransform(1.7)
      refOrange.current!.style = getRandomTransform(2.7)
    }

    updatePosition()
    const t = setInterval(updatePosition, TRANSITION_DURATION_MS - 1000)

    return () => window.clearInterval(t)
  }, [])

  return (
    <>
      <Button
        iconOnly
        className={styles.createButton}
        variant="ghost"
        commandfor="new-project-modal"
        command="show-modal"
        style={{ '--duration': TRANSITION_DURATION_MS + 'ms' } as React.CSSProperties}
      >
        <PlusIcon />
        <div ref={refCyan} className={cn(styles.color, styles.cyan)} />
        <div ref={refMagenta} className={cn(styles.color, styles.magenta)} />
        <div ref={refOrange} className={cn(styles.color, styles.orange)} />
        <div className={styles.roundedGradient} />
      </Button>
      <Suspense>
        <NewProjectModal />
      </Suspense>
    </>
  )
}
