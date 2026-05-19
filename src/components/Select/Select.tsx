import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import useUniqueId from '@/hooks/useUniqueId/useUniqueId'
import styles from './Select.module.css'

export interface SelectOption<T extends string = string> {
  value: T
  label: React.ReactNode
  /** React node displayed on the left side of the label (e.g. an icon, swatch, avatar). */
  leading?: React.ReactNode
  disabled?: boolean
}

interface Props<T extends string = string> {
  label?: string
  value: T
  options: Array<SelectOption<T>>
  onChange: (value: T) => void
  placeholder?: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function Select<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  className,
  disabled,
}: Props<T>) {
  const rootId = useUniqueId()
  const listboxId = `${rootId}-listbox`
  const labelId = `${rootId}-label`

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(
      options.findIndex((o) => o.value === value),
      0
    )
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    // sync the active index with the currently selected value when opening
    const idx = options.findIndex((o) => o.value === value)
    if (idx >= 0) setActiveIndex(idx)
    // focus the list so keyboard navigation works immediately
    listRef.current?.focus()
  }, [isOpen, value, options])

  const open = () => {
    if (disabled) return
    setIsOpen(true)
  }

  const close = (refocusTrigger = true) => {
    setIsOpen(false)
    if (refocusTrigger) {
      // wait a tick so blur events don't fight us
      requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }

  const commit = (option: SelectOption<T>) => {
    if (option.disabled) return
    onChange(option.value)
    close()
  }

  const moveActive = (dir: 1 | -1) => {
    if (options.length === 0) return
    let next = activeIndex
    for (let i = 0; i < options.length; i++) {
      next = (next + dir + options.length) % options.length
      if (!options[next]?.disabled) break
    }
    setActiveIndex(next)
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveActive(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveActive(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[activeIndex]
      if (opt) commit(opt)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault()
      close()
    }
  }

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={styles.triggerContent}>
          {selectedOption ? (
            <>
              {selectedOption.leading !== undefined && (
                <span className={styles.leading} aria-hidden="true">
                  {selectedOption.leading}
                </span>
              )}
              <span className={styles.triggerLabel}>{selectedOption.label}</span>
            </>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={
            options[activeIndex] ? `${rootId}-option-${activeIndex}` : undefined
          }
          className={styles.list}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex

            return (
              <li
                key={option.value}
                id={`${rootId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={cn(
                  styles.option,
                  isActive && styles.optionActive,
                  isSelected && styles.optionSelected,
                  option.disabled && styles.optionDisabled
                )}
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                onClick={() => commit(option)}
              >
                {option.leading !== undefined && (
                  <span className={styles.leading} aria-hidden="true">
                    {option.leading}
                  </span>
                )}
                <span className={styles.optionLabel}>{option.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
