import { useLayoutEffect, useRef } from 'react'
import { Editor, PrismEditor } from 'prism-react-editor'
import { BasicSetup } from 'prism-react-editor/setups'
import { ProgramCompilationInfo } from '@mateuszjs/magic-render/types'
import onTokenize from './onTokenize'

// Adding the WGSL grammar
import 'prism-react-editor/prism/languages/wgsl'

// Adds comment toggling and auto-indenting for WGSL
import 'prism-react-editor/languages/wgsl'

import 'prism-react-editor/layout.css'
import 'prism-react-editor/themes/github-dark.css'

// Required by the basic setup
import 'prism-react-editor/search.css'

// out custom overrides
import './overridePrismStyles.css'

interface Props {
  value: string
  onChange: (value: string, commit: boolean) => void
  compilationInfo?: ProgramCompilationInfo
}

export default function EditorWrapper({ value, onChange, compilationInfo }: Props) {
  const initialValue = useRef(value) /* changing value causes reset of the editor */
  const editorEl = useRef<PrismEditor>(null)

  const compInfoRef = useRef(compilationInfo) // to ensure onTokenzie always reads up to date errors
  compInfoRef.current = compilationInfo

  const onUpdateCode = (code: string) => {
    if (value !== code) {
      onChange(code, true)
    }
  }

  useLayoutEffect(() => {
    editorEl.current?.update()
  }, [compilationInfo])

  return (
    <>
      <Editor
        language="wgsl"
        value={initialValue.current}
        onUpdate={onUpdateCode}
        wordWrap
        onTokenize={(tokens) => onTokenize(compInfoRef.current, tokens)}
        ref={editorEl}
      >
        {(editor) => <BasicSetup editor={editor} />}
      </Editor>
    </>
  )
}
