import cn from 'classnames'
import CodeSymbol from 'assets/code-symbol.svg'
import { CustomProgramError } from '@mateuszjs/magic-render/types'
import Popover from '@/components/Popover/Popover'
import EditorWrapper from './components/EditorWrapper'
import styles from './CodeInput.module.css'

interface Props {
  value: string
  onChange: (value: string, commit: boolean) => void
  error?: CustomProgramError
  className?: string
}

export default function CodeInput({ value, onChange, error, className }: Props) {
  return (
    <>
      <Popover
        trigger={() => <CodeSymbol />}
        className={cn(styles.triggerBtn, className)}
        aria-label="Open code editor"
        variant="ghost"
        noHover
      >
        <EditorWrapper value={value} onChange={onChange} error={error} />
        {error && (
          <section>
            <h4 className={styles.errorTitle}>Compilation Error:</h4>
            <p className={styles.errorBody}>
              Line {error.lineNum}:{error.linePos} {error.message}
            </p>
          </section>
        )}
      </Popover>
    </>
  )
}
