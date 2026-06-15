'use client'

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type ToggleEventHandler,
} from 'react'
import cn from 'classnames'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './CustomSelect.module.css'

interface SelectContextValue<T = unknown> {
  selectedValue: T
  select: (value: T) => void
  preview: (value: T) => void
}

const SelectContext = createContext<SelectContextValue | null>(null)

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
      onMouseEnter={(e) => {
        ctx.preview(value)
        onMouseEnter?.(e)
      }}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {children}
    </button>
  )
}

type CustomSelectOptionElement<T> = ReactElement<OptionProps<T>, typeof CustomSelectOption>

interface Props<T> {
  value: T
  onChange: (value: T, commit: boolean) => void
  children: CustomSelectOptionElement<T> | CustomSelectOptionElement<T>[]
  /** Preview hovered options with commit=false and revert when the menu closes. */
  previewOnHover?: boolean
  /** Shown in the trigger when no matching option is found. */
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

function findSelectedLabel<T>(
  children: CustomSelectOptionElement<T> | CustomSelectOptionElement<T>[],
  value: T
): ReactNode | undefined {
  const options = Children.toArray(children) as CustomSelectOptionElement<T>[]

  return options.find((option) => option.props.value === value)?.props.children
}

export function CustomSelect<T>({
  value,
  onChange,
  children,
  previewOnHover = false,
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
  const committedValueRef = useRef(value)
  const didCommitRef = useRef(false)
  const selectedLabel = useMemo(() => findSelectedLabel(children, value), [children, value])

  const revert = useCallback(() => {
    if (!previewOnHover || didCommitRef.current) return
    onChange(committedValueRef.current, false)
  }, [onChange, previewOnHover])

  const preview = useCallback(
    (newValue: T) => {
      if (!previewOnHover || didCommitRef.current) return
      onChange(newValue, false)
    },
    [onChange, previewOnHover]
  )

  const select = useCallback(
    (newValue: T) => {
      didCommitRef.current = true
      onChange(newValue, true)
      popoverRef.current?.hidePopover?.()
    },
    [onChange]
  )

  const onToggle: ToggleEventHandler<HTMLDivElement> = (event) => {
    if (event.target !== event.currentTarget) return
    const open = event.newState === 'open'
    setIsOpen(open)

    if (open) {
      committedValueRef.current = value
      didCommitRef.current = false
      onOpen?.()
      return
    }

    revert()
    onClose?.()
  }

  const anchorName = `--${popoverId}-anchor`
  const ctxValue: SelectContextValue = {
    selectedValue: value,
    select: select as (v: unknown) => void,
    preview: preview as (v: unknown) => void,
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
        <span className={cn(styles.label, selectedLabel === undefined && styles.placeholder)}>
          {selectedLabel ?? placeholder}
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
        onMouseLeave={revert}
      >
        {isOpen ? children : null}
      </div>
    </SelectContext.Provider>
  )
}
