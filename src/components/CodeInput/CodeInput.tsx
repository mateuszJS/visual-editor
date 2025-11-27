import styles from './CodeInput.module.css'
import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'
import CodeSymbol from 'assets/code-symbol.svg'
import type { CustomProgramError } from '@mateuszjs/magic-render'
import EditorWrapper from './components/EditorWrapper'
import Popover from '../Popover/Popover'

interface Props {
  value: string
  onChange: (value: string, commit: boolean) => void
  errors: CustomProgramError[] | undefined
  className?: string
}

export default function CodeInput({ value, onChange, errors, className }: Props) {
  return (
    <>
      <Popover
        trigger={() => <CodeSymbol />}
        popoverClassName={styles.popover}
        className={cn(styles.triggerBtn, numberInputStyles.input, className)}
        aria-label="Open code editor"
      >
        <EditorWrapper initialValue={value} onChange={onChange} />
        {errors && errors.length > 0 && (
          <ul className={styles.errorList}>
            {errors.map((error, index) => (
              <li key={index} className={styles.errorItem}>
                Line {error.line}: {error.message}
              </li>
            ))}
          </ul>
        )}
      </Popover>
    </>
  )
}
