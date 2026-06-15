'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type ToggleEventHandler,
} from 'react'
import cn from 'classnames'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './CustomSelect.module.css'

interface SelectContextValue<T = unknown> {
  selectedValue: T
  select: (value: T) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

interface Props<T> {
  value: T
  onChange: (value: T) => void
  /**
   * Options to render inside the dropdown. Use `CustomSelectOption` for default
   * styling, or render any custom element — the parent controls the markup.
   */
  children: ReactNode
  /** Content shown in the trigger button (typically the label of the selected option). */
  display?: ReactNode
  /** Shown in the trigger when nothing is selected (or `display` is empty). */
  placeholder?: ReactNode
  className?: string
  popoverClassName?: string
  /** Disable opening the dropdown. */
  disabled?: boolean
  /** Called when the dropdown opens. */
  onOpen?: () => void
  /** Called when the dropdown closes. */
  onClose?: () => void
}

export default function CustomSelect<T>({
  value,
  onChange,
  children,
  display,
  placeholder = 'Select…',
  className,
  popoverClassName,
  disabled,
  onOpen,
  onClose,
}: Props<T>) {
  const popoverId = useUniqueId()
  const popoverRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const select = useCallback(
    (newValue: T) => {
      onChange(newValue)
      popoverRef.current?.hidePopover?.()
    },
    [onChange]
  )

  const onToggle: ToggleEventHandler<HTMLDivElement> = (event) => {
    if (event.target !== event.currentTarget) return
    const open = event.newState === 'open'
    setIsOpen(open)
    if (open) onOpen?.()
    else onClose?.()
  }

  const anchorName = `--${popoverId}-anchor`
  const ctxValue: SelectContextValue = {
    selectedValue: value,
    select: select as (v: unknown) => void,
  }

  return (
    <SelectContext.Provider value={ctxValue}>
      <button
        type="button"
        popoverTarget={popoverId}
        disabled={disabled}
        className={cn(styles.trigger, className)}
        style={{ ['--anchor-name' as string]: anchorName } as CSSProperties}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={cn(styles.label, !display && styles.placeholder)}>
          {display ?? placeholder}
        </span>
        <span className={styles.arrow} aria-hidden="true" />
      </button>
      <div
        id={popoverId}
        ref={popoverRef}
        popover="auto"
        role="listbox"
        className={cn(styles.popover, popoverClassName)}
        style={{ ['--anchor-name' as string]: anchorName } as CSSProperties}
        onToggle={onToggle}
      >
        {isOpen ? children : null}
      </div>
    </SelectContext.Provider>
  )
}

interface OptionProps<T> {
  value: T
  children: ReactNode
  className?: string
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
}

export function CustomSelectOption<T>({
  value,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: OptionProps<T>) {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('CustomSelectOption must be rendered inside a CustomSelect')
  }
  const selected = ctx.selectedValue === value

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(styles.option, selected && styles.selected, className)}
      onClick={() => ctx.select(value)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  )
}
