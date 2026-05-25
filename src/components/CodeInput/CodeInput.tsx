import cn from 'classnames'
import CodeSymbol from 'assets/code-symbol.svg'
import { ProgramCompilationInfo } from '@mateuszjs/magic-render/types'
import Popover from '@/components/Popover/Popover'
import EditorWrapper from './components/EditorWrapper'
import styles from './CodeInput.module.css'

interface Props {
  value: string
  onChange: (value: string, commit: boolean) => void
  compilationInfo?: ProgramCompilationInfo
  className?: string
}

export default function CodeInput({ value, onChange, compilationInfo, className }: Props) {
  return (
    <>
      <Popover
        trigger={() => <CodeSymbol />}
        className={cn(styles.triggerBtn, className)}
        popoverClassName={styles.popover}
        aria-label="Open code editor"
        variant="ghost"
        noHover
      >
        <EditorWrapper value={value} onChange={onChange} compilationInfo={compilationInfo} />
        {compilationInfo && (
          <section className={styles.infoSection}>
            <h4
              className={cn(styles.infoTitle, compilationInfo.type === 'warning' && styles.warning)}
            >
              {compilationInfo.type === 'error' ? 'Compilation Error:' : 'Compilation Warning:'}
            </h4>
            <p className={styles.infoBody}>
              Line {compilationInfo.lineNum}:{compilationInfo.linePos} {compilationInfo.message}
            </p>
          </section>
        )}
      </Popover>
    </>
  )
}
