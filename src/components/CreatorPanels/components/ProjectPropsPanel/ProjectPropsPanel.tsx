import NumberInput from '@/components/NumberInput/NumberInput'
import styles from './ProjectPropsPanel.module.css'
import useProject from '@/hooks/useProject/useProject'
import useProjectId from '@/hooks/useProjectId/useProjectId'
import useCreator from '@/hooks/useCreator/useCreator'
import PanelWrapper from '../PanelWrapper/PanelWrapper'

export default function ProjectPropsPanel() {
  const id = useProjectId()
  const { project } = useProject(id)
  const { selectedAssetId, setProjectSize } = useCreator()

  if (!project || selectedAssetId != null) {
    return null
  }

  return (
    <PanelWrapper id="projectProps">
      <div className={styles.root}>
        <NumberInput
          label="W:"
          name="width"
          value={project.width}
          onChange={(width) => setProjectSize(width, project.height)}
          unit="px"
        />
        <span className="spacer" />
        <NumberInput
          label="H:"
          name="height"
          value={project.height}
          onChange={(height) => setProjectSize(project.width, height)}
          unit="px"
        />
      </div>
    </PanelWrapper>
  )
}
