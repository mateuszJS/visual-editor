import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import BoundsPanel from './components/BoundsPanel/BoundsPanel'
import ShapePropsPanel from './components/ShapePropsPanel/ShapePropsPanel'
import styles from './CreatorPanels.module.css'
import ProjectPropsPanel from './components/ProjectPropsPanel/ProjectPropsPanel'

export default function CreatorPanels() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }
  return (
    <section className={styles.root}>
      <ProjectPropsPanel />
      <BoundsPanel />
      <ShapePropsPanel />
    </section>
  )
}
