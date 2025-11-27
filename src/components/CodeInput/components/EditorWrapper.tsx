import { useRef } from 'react'
import { Editor } from 'prism-react-editor'
import { BasicSetup } from 'prism-react-editor/setups'

// Adding the JSX grammar
import 'prism-react-editor/prism/languages/jsx'

// Adds comment toggling and auto-indenting for JSX
import 'prism-react-editor/languages/jsx'

import 'prism-react-editor/layout.css'
import 'prism-react-editor/themes/github-dark.css'

// Required by the basic setup
import 'prism-react-editor/search.css'

interface Props {
  initialValue: string
  onChange: (value: string, commit: boolean) => void
}

export default function EditorWrapper({ initialValue, onChange }: Props) {
  const initialValueRef = useRef(initialValue)

  const onUpdateCode = (code: string) => {
    // Editor triggers this event on first render
    if (initialValueRef.current !== code) {
      onChange(code, true)
    }
  }

  /* changing value causes reset of the editor */
  return (
    <Editor language="jsx" value={initialValueRef.current} onUpdate={onUpdateCode}>
      {(editor) => <BasicSetup editor={editor} />}
    </Editor>
  )
}
