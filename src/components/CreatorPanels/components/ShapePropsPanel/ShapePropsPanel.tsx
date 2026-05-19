import useCreator from '@/hooks/useCreator/useCreator'
import { useSnapshot } from 'valtio'
import styles from './ShapePropsPanel.module.css'
import NumberInput from '@/components/NumberInput/NumberInput'
import EffectPanel from './components/EffectPanel/EffectPanel'
import PlusIcon from 'assets/plus-icon.svg'
import { assetState } from '@/stores/asset'
import PanelWrapper from '../PanelWrapper/PanelWrapper'
import { Program, ProgramInputs } from '@mateuszjs/magic-render/types'

export default function ShapePropsPanel() {
  const { props, program, inputs, bounds } = useSnapshot(assetState)
  const creator = useCreator()

  function getOnChangeEffect(index: number) {
    if (!inputs) throw Error('Edit has happened while there is no inputs available')
    return (newProgram: Program, modifiedInputRow: ProgramInputs['props'], commit: boolean) => {
      creator.creator.updateAssetProgram(
        newProgram,
        {
          id: inputs.id,
          props: {
            ...inputs.props,
            ...modifiedInputRow,
          },
        },
        commit
      )
    }
  }

  // function addNewEffect() {
  //   if (!props) throw Error('No props available while adding SDF effect!')
  //   if (!effects) throw Error('You cannot modified effects of element that has no effects')

  //   const newEffect: Effect = {
  //     fill: { solid: [1, 1, 1, 1] },
  //     dist_start: 5,
  //     dist_end: -5,
  //   }
  //   creator.creator.updateAssetEffects([...effects, newEffect], true)
  // }

  if (!props || !bounds) {
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

  const width = Math.hypot(bounds[0].y - bounds[1].y, bounds[0].x, -bounds[1].x)
  const height = Math.hypot(bounds[0].y - bounds[3].y, bounds[0].x, -bounds[3].x)
  const distance = Math.max(width, height) * 0.5

  return (
    <PanelWrapper id="shapeProps">
      <div>
        {program && inputs && (
          <EffectPanel
            program={program}
            inputs={inputs.props}
            onChange={getOnChangeEffect(0)}
            minDistance={-distance}
            maxDistance={+distance}
          />
        )}
        {/* <div>
          <button className={styles.button} onClick={addNewEffect}>
            <PlusIcon />
            Add Effect
          </button>
        </div> */}
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
