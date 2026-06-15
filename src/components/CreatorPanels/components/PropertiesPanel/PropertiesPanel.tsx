import useCreator from '@/hooks/useCreator/useCreator'
import { useSnapshot } from 'valtio'
import NumberInput from '@/components/NumberInput/NumberInput'
import { assetState } from '@/stores/asset'
import PanelWrapper from '../PanelWrapper/PanelWrapper'

export function PropertiesPanel() {
  const { props } = useSnapshot(assetState)
  const creator = useCreator()

  if (!props) {
    return null
  }

  function setBlur(x: number, y: number, commit: boolean) {
    if (!props) throw Error('No props available while modifying blur!')

    creator.creator.updateAssetProps(
      {
        ...props,
        blur: x === 0 && y === 0 ? null : { x, y },
      },
      commit
    )
  }

  return (
    <PanelWrapper id="properties">
      <div>
        {props.opacity !== undefined && (
          <NumberInput
            min={0}
            max={100}
            label="Opacity:"
            value={props.opacity * 100}
            onChange={(value, commit) =>
              creator.creator.updateAssetProps({ ...props, opacity: value / 100 }, commit)
            }
            unit="%"
          />
        )}
        {props.blur && (
          <div>
            <h4>Blur</h4>
            <NumberInput
              label="x:"
              value={props.blur.x}
              onChange={(x, commit) => setBlur(x, props.blur?.y ?? 0, commit)}
              unit="px"
            />
            <NumberInput
              label="y:"
              value={props.blur.y}
              onChange={(y, commit) => setBlur(props.blur?.x ?? 0, y, commit)}
              unit="px"
            />
          </div>
        )}
      </div>
    </PanelWrapper>
  )
}
