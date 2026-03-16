import numberInputStyles from '@/components/NumberInput/NumberInput.module.css'
import cn from 'classnames'
import CodeSymbol from 'assets/code-symbol.svg'
import { CustomProgramError } from '@mateuszjs/magic-render/types'
import Popover from '@/components/Popover/Popover'
import EditorWrapper from './components/EditorWrapper'
import styles from './CodeInput.module.css'

interface Props {
  value: string
  onChange: (value: string, commit: boolean) => void
  errors: CustomProgramError[] | undefined
  className?: string
}

export default function CodeInput({ value, onChange, errors, className }: Props) {
  return (
    /* render code editor base on:
    https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
    */
    <>
      <Popover
        trigger={() => <CodeSymbol />}
        className={cn(styles.triggerBtn, numberInputStyles.input, className)}
        aria-label="Open code editor"
      >
        <EditorWrapper initialValue={value} onChange={onChange} />
        {errors && errors.length > 0 && (
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                Line {error.lineNum}: {error.message}
              </li>
            ))}
          </ul>
        )}
      </Popover>
    </>
  )
}
