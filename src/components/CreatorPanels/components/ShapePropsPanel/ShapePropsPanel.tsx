import useCreator from '@/hooks/useCreator/useCreator'
import { SdfEffect } from '@mateuszjs/magic-render'
import { useSnapshot } from 'valtio'
import styles from './ShapePropsPanel.module.css'
import NumberInput from '@/components/NumberInput/NumberInput'
import Effect from './components/Effects/Effect'
import PlusIcon from 'assets/plus-icon.svg'
import { assetState } from '@/stores/asset'

export default function ShapePropsPanel() {
  const { props } = useSnapshot(assetState)
  const creator = useCreator()

  function getOnChangeEffect(index: number) {
    return (newEffect: SdfEffect | null, commit: boolean) => {
      if (!props) throw Error('No props available while modifying SDF effect!')

      creator.creator.updateAssetProps(
        {
          ...props,
          sdf_effects: props.sdf_effects
            .map((effect, i) => (i === index ? newEffect : effect))
            .filter(Boolean),
        },
        commit
      )
    }
  }

  function addNewEffect() {
    if (!props) throw Error('No props available while adding SDF effect!')
    const newEffect: SdfEffect = {
      fill: { solid: [1, 1, 1, 1] },
      dist_start: 5,
      dist_end: -5,
    }
    creator.creator.updateAssetProps(
      {
        ...props,
        sdf_effects: [...(props.sdf_effects || []), newEffect],
      },
      true
    )
  }

  if (!props) {
    return null
  }

  return (
    <fieldset>
      <legend>Shape Properties</legend>
      <ol>
        {props.sdf_effects?.map((effect, index) => (
          <Effect key={index} {...effect} onChange={getOnChangeEffect(index)} />
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
            creator.creator.updateAssetProps({ ...props, opacity: value / 100 }, commit)
          }
          unit="%"
        />
      )}
      {props.filter && (
        <div>
          <h4>Blur</h4>
          <NumberInput
            label="x:"
            value={props.filter.gaussianBlur.x}
            onChange={(x, commit) =>
              creator.creator.updateAssetProps(
                {
                  ...props,
                  filter: {
                    ...props.filter,
                    gaussianBlur: { x, y: props!.filter!.gaussianBlur.y },
                  },
                },
                commit
              )
            }
            unit="px"
          />
          <NumberInput
            label="y:"
            value={props.filter.gaussianBlur.y}
            onChange={(y, commit) =>
              creator.creator.updateAssetProps(
                {
                  ...props,
                  filter: {
                    ...props.filter,
                    gaussianBlur: { x: props!.filter!.gaussianBlur.x, y },
                  },
                },
                commit
              )
            }
            unit="px"
          />
        </div>
      )}
    </fieldset>
  )
}
