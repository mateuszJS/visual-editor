import useCreator from '@/hooks/useCreator/useCreator'
import { assetState } from '@/stores/asset'
import { useSnapshot } from 'valtio'
import PanelWrapper from '../PanelWrapper/PanelWrapper'
import NumberInput from '@/components/NumberInput/NumberInput'
import { CustomSelect, CustomSelectOption } from '@/components/CustomSelect/CustomSelect'
import type { TypoProps } from '@mateuszjs/magic-render/types'
import FontSizeIcon from 'assets/font-size.svg'
import LineHeightIcon from 'assets/line-height.svg'
import LetterSpacingIcon from 'assets/typo-tracking.svg'
import SharedEffectsIcon from 'assets/shared-effects.svg'
import IsolatedEffectsIcon from 'assets/isolated-effects.svg'
import styles from './TypographyPanel.module.css'
import Button from '@/components/Button/Button'

const LETTER_SPACING_PLACEHOLDER = 0

export default function TypographyPanel() {
  const { typoProps } = useSnapshot(assetState)
  const creator = useCreator()

  if (!creator.isReady || typoProps === null) return null

  const currentTypoProps = typoProps
  const isShared = currentTypoProps.is_sdf_shared

  const fontEntries = Object.entries(creator.fonts)

  function updateTypoProps(partial: Partial<TypoProps>, commit: boolean) {
    const next: TypoProps = {
      font_size: partial.font_size ?? currentTypoProps.font_size,
      font_family_id: partial.font_family_id ?? currentTypoProps.font_family_id,
      line_height: partial.line_height ?? currentTypoProps.line_height,
      is_sdf_shared: partial.is_sdf_shared ?? currentTypoProps.is_sdf_shared,
    }
    creator.updateAssetTypoProps(next, commit)
  }

  return (
    <PanelWrapper id="typography">
      <div className={styles.panel}>
        <div className={styles.root}>
          <CustomSelect
            className={styles.fullWidth}
            value={currentTypoProps.font_family_id}
            placeholder="Select font"
            previewOnHover
            onChange={(fontFamilyId, commit) =>
              updateTypoProps({ font_family_id: fontFamilyId }, commit)
            }
          >
            {fontEntries.map(([name, id]) => (
              <CustomSelectOption key={id} value={id}>
                {name}
              </CustomSelectOption>
            ))}
          </CustomSelect>

          <NumberInput
            label={<FontSizeIcon aria-hidden />}
            aria-label="Font size"
            value={currentTypoProps.font_size}
            onChange={(font_size, commit) => updateTypoProps({ font_size }, commit)}
            unit="px"
            min={1}
          />
          <span className="spacer" />
          <NumberInput
            label={<LetterSpacingIcon aria-hidden />}
            aria-label="Letter spacing"
            value={LETTER_SPACING_PLACEHOLDER}
            onChange={() => {}}
            unit="px"
            disabled
          />

          <NumberInput
            label={<LineHeightIcon aria-hidden />}
            aria-label="Line height"
            value={currentTypoProps.line_height}
            onChange={() => {}}
            disabled
          />
        </div>

        <Button
          variant="chunky"
          onClick={() => updateTypoProps({ is_sdf_shared: !isShared }, true)}
        >
          {isShared ? <SharedEffectsIcon aria-hidden /> : <IsolatedEffectsIcon aria-hidden />}
          {isShared ? 'Shared effects' : 'Isolated effects'}
        </Button>
      </div>
    </PanelWrapper>
  )
}
