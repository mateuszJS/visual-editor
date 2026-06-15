import useCreator from '@/hooks/useCreator/useCreator'
import { useSnapshot } from 'valtio'
import EffectPanel from './components/EffectPanel/EffectPanel'
import { assetState } from '@/stores/asset'
import PanelWrapper from '../PanelWrapper/PanelWrapper'
import { ProgramInputs } from '@mateuszjs/magic-render/types'
import Button from '@/components/Button/Button'
import PlusIcon from 'assets/plus-icon.svg'
import styles from './EffectsListPanel.module.css'
import { SOLID_FILL_CODE } from '@/components/ProgramsList/ProgramsList'
import { DragDropProvider, DragEndEvent, DragOverEvent } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { useRef } from 'react'

export function EffectsListPanel() {
  const { program, inputs, bounds } = useSnapshot(assetState)
  const creator = useCreator()
  const lastTargetId = useRef<number | null>(null)

  function getOnChangeEffect(snippetId: number) {
    if (!program) throw Error('Edit has happened while there is no program available')
    if (!inputs) throw Error('Edit has happened while there is no inputs available')
    return (code: string, modifiedInputRow: ProgramInputs['props'], commit: boolean) => {
      creator.creator.updateAssetProgram(
        {
          ...program,
          codeSnippets: program.codeSnippets.map((snippet) =>
            // prettier-ignore
            snippet.id === snippetId
              ? { id: snippet.id, content: code }
              : snippet
          ),
        },
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

  function addNewEffect() {
    if (!program) throw Error('Edit has happened while there is no program available')
    if (!inputs) throw Error('Edit has happened while there is no inputs available')

    const newId = Math.max(0, ...program.codeSnippets.map((snippet) => snippet.id)) + 1
    creator.creator.updateAssetProgram(
      {
        ...program,
        // prettier-ignore
        codeSnippets: [
          ...program.codeSnippets,
          { id: newId, content: SOLID_FILL_CODE }
        ],
      },
      inputs,
      true
    )
  }

  if (!bounds) {
    return null
  }

  const width = Math.hypot(bounds[0].y - bounds[1].y, bounds[0].x, -bounds[1].x)
  const height = Math.hypot(bounds[0].y - bounds[3].y, bounds[0].x, -bounds[3].x)
  const distance = Math.max(width, height) * 0.5

  const orderedSnippets = program?.codeSnippets.toReversed() ?? []

  function handleDragEnd(event: DragEndEvent) {
    if (!inputs) throw Error('Edit has happened while there is no inputs available')

    const newSnippets = move(orderedSnippets, event)
    // creator.reorderAssets(newAssets.toReversed())
    creator.creator.updateAssetProgram(
      {
        ...program,
        codeSnippets: newSnippets.toReversed(),
      },
      inputs,
      true
    )
  }
  function handleDragOver(event: DragOverEvent) {
    if (!inputs) throw Error('Edit has happened while there is no inputs available')

    const { source, target } = event.operation
    const overId = (target?.id as number) ?? null

    // Ignore if we're still over the same droppable
    if (overId === lastTargetId.current) return
    lastTargetId.current = overId

    // Your actual logic runs once per new target
    if (!target || source?.id === target.id) return

    const newSnippets = move(orderedSnippets, event)

    creator.creator.updateAssetProgram(
      {
        ...program,
        codeSnippets: newSnippets.toReversed(),
      },
      inputs,
      false
    )
  }

  return (
    <PanelWrapper id="effects">
      <div>
        <Button small variant="ghost" className={styles.addEffectButton} onClick={addNewEffect}>
          <PlusIcon />
          <span>Add Effect</span>
        </Button>
        <DragDropProvider onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          {program &&
            inputs &&
            orderedSnippets.map((snippet, index) => (
              <EffectPanel
                id={snippet.id}
                index={index}
                key={snippet.id}
                code={snippet.content}
                inputs={Object.entries(inputs.props).reduce((acc, [key, value]) => {
                  const snippetId = Number(key.split('_').pop())
                  if (snippetId === snippet.id) return { ...acc, [key]: value }
                  return acc
                }, {})}
                onChange={getOnChangeEffect(snippet.id)}
                minDistance={-distance}
                maxDistance={+distance}
              />
            ))}
        </DragDropProvider>
      </div>
    </PanelWrapper>
  )
}
