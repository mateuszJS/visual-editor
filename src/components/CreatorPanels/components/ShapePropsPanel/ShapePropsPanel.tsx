import useCreator from '@/hooks/useCreator/useCreator'
import type { Effect } from '@mateuszjs/magic-render/types'
import { useSnapshot } from 'valtio'
import styles from './ShapePropsPanel.module.css'
import NumberInput from '@/components/NumberInput/NumberInput'
import EffectPanel from './components/EffectPanel/EffectPanel'
import PlusIcon from 'assets/plus-icon.svg'
import { assetState } from '@/stores/asset'
import PanelWrapper from '../PanelWrapper/PanelWrapper'

export default function ShapePropsPanel() {
  const { props, effects } = useSnapshot(assetState)
  const creator = useCreator()

  function getOnChangeEffect(index: number) {
    return (newEffect: Effect | null, commit: boolean) => {
      if (!props) throw Error('No props available while modifying SDF effect!')
      if (!effects) throw Error('You cannot modify effects of element that has no effects')

      creator.creator.updateAssetProps(
        props,
        effects.map((effect, i) => (i === index ? newEffect : effect)).filter(Boolean),
        commit
      )
    }
  }

  function addNewEffect() {
    if (!props) throw Error('No props available while adding SDF effect!')
    if (!effects) throw Error('You cannot modified effects of element that has no effects')

    const newEffect: Effect = {
      fill: { solid: [1, 1, 1, 1] },
      dist_start: 5,
      dist_end: -5,
    }
    creator.creator.updateAssetProps(props, [...effects, newEffect], true)
  }

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
      effects ?? [],
      commit
    )
  }

  return (
    <PanelWrapper id="shapeProps">
      <div>
        <ol>
          {effects?.map((effect, index) => (
            <EffectPanel key={index} {...effect} onChange={getOnChangeEffect(index)} />
          ))}
        </ol>
        <div>
          <button className={styles.button} onClick={addNewEffect}>
            <PlusIcon />
            Add Effect
          </button>
        </div>
        {props.opacity !== undefined && (
          <NumberInput
            label="Opacity:"
            value={props.opacity * 100}
            onChange={(value, commit) =>
              creator.creator.updateAssetProps(
                { ...props, opacity: value / 100 },
                effects ?? [],
                commit
              )
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
