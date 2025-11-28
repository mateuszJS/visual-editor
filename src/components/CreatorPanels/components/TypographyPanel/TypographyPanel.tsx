import useCreator from '@/hooks/useCreator/useCreator'
import { assetState } from '@/stores/asset'
import { useSnapshot } from 'valtio'
import PanelWrapper from '../PanelWrapper/PanelWrapper'

export default function TypographyPanel() {
  const { typoProps } = useSnapshot(assetState)
  const creator = useCreator()

  if (!creator.isReady || typoProps === null) return null

  return (
    <PanelWrapper id="typography">
      <div>
        <select
          value={typoProps.font_family_id}
          onChange={(e) => {
            const fontFamily = Number(e.target.value)
            creator.updateAssetTypoProps(
              {
                ...typoProps,
                font_family_id: fontFamily,
              },
              true
            )
          }}
        >
          <option value="" disabled>
            Select font
          </option>
          {Object.entries(creator.fonts).map(([name, id]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </PanelWrapper>
  )
}
