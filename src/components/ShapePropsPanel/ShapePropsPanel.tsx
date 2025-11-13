import useCreator, { assetState } from '@/hooks/useCreator/useCreator'
import { SdfEffect, ShapeProps } from '@mateuszjs/magic-render'
import { useSnapshot } from 'valtio'
import styles from './ShapePropsPanel.module.css'
import NumberInput from '../NumberInput/NumberInput'
import Effect from './components/Effects/Effect'
import PlusIcon from 'assets/plus-icon.svg'

export default function ShapePropsPanel() {
  const { props: _props } = useSnapshot(assetState)
  const props = _props as ShapeProps | null
  const creator = useCreator()

  function getOnChangeEffect(index: number) {
    return (newEffect: SdfEffect) => {
      if (!props) throw Error('No props available while modyfing SDF effect!')
      creator.creator.updateAssetProps({
        ...props,
        sdf_effects: props.sdf_effects.map((effect, i) => (i === index ? newEffect : effect)),
      })
    }
  }

  function addNewEffect() {
    if (!props) throw Error('No props available while adding SDF effect!')
    const newEffect: SdfEffect = {
      fill: { solid: [1, 1, 1, 1] },
      dist_start: 5,
      dist_end: -5,
    }
    creator.creator.updateAssetProps({
      ...props,
      sdf_effects: [...(props.sdf_effects || []), newEffect],
    })
  }

  if (!props) {
    return null
  }

  return (
    <section>
      <h3 className={styles.title}>Shape Properties</h3>
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
      <NumberInput
        label="Opacity:"
        value={props.opacity * 100}
        onChange={(value) => creator.creator.updateAssetProps({ ...props, opacity: value / 100 })}
        unit="%"
      />
      {props.filter && (
        <div>
          <h4>Blur</h4>
          <NumberInput
            label="x:"
            value={props.filter.gaussianBlur.x}
            onChange={(x) =>
              creator.creator.updateAssetProps({
                ...props,
                filter: { ...props.filter, gaussianBlur: { x, y: props!.filter!.gaussianBlur.y } },
              })
            }
            unit="px"
          />
          <NumberInput
            label="y:"
            value={props.filter.gaussianBlur.y}
            onChange={(y) =>
              creator.creator.updateAssetProps({
                ...props,
                filter: { ...props.filter, gaussianBlur: { x: props!.filter!.gaussianBlur.x, y } },
              })
            }
            unit="px"
          />
        </div>
      )}
    </section>
  )
}
