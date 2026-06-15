import useIsMobile from '@/hooks/useIsMobile/useIsMobile'
import BoundsPanel from './components/BoundsPanel/BoundsPanel'
import { EffectsListPanel } from './components/EffectsListPanel/EffectsListPanel'
import styles from './CreatorPanels.module.css'
import ProjectPropsPanel from './components/ProjectPropsPanel/ProjectPropsPanel'
import TypographyPanel from './components/TypographyPanel/TypographyPanel'
import LayersPanel from './components/LayersPanel/LayersPanel'
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel'

export default function CreatorPanels() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return null
  }
  return (
    <section className={styles.root}>
      <ProjectPropsPanel />
      <BoundsPanel />
      <EffectsListPanel />
      <TypographyPanel />
      <PropertiesPanel />
      <div className="mt-auto mb-16">
        <LayersPanel />
      </div>
    </section>
  )
}
