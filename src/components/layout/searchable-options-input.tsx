"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchableOptionsInputProps {
  id: string
  value: string
  invalid: boolean
  options: Array<{ value: string; label: string }>
  placeholder: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  noResultsText: string
  normalizeValue?: (value: string) => string
  onChange: (value: string) => void
}

export function SearchableOptionsInput({
  id,
  value,
  invalid,
  options,
  placeholder,
  inputMode,
  noResultsText,
  normalizeValue = (inputValue) => inputValue,
  onChange,
}: SearchableOptionsInputProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const normalizedSearch = value.toLocaleLowerCase("pt-BR")
  const filteredOptions = options.filter((option) =>
    `${option.value} ${option.label}`
      .toLocaleLowerCase("pt-BR")
      .includes(normalizedSearch)
  )

  function selectOption(optionValue: string) {
    onChange(optionValue)
    setOpen(false)
    setActiveIndex(0)
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        id={id}
        type="search"
        inputMode={inputMode}
        autoComplete="one-time-code"
        className="pl-9"
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={`${id}-suggestions`}
        aria-expanded={open}
        aria-invalid={invalid}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onChange(normalizeValue(event.target.value))
          setOpen(true)
          setActiveIndex(0)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(true)
            setActiveIndex((current) =>
              filteredOptions.length
                ? Math.min(current + 1, filteredOptions.length - 1)
                : 0
            )
          }

          if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((current) => Math.max(current - 1, 0))
          }

          if (event.key === "Enter" && open && filteredOptions[activeIndex]) {
            event.preventDefault()
            selectOption(filteredOptions[activeIndex].value)
          }

          if (event.key === "Escape") setOpen(false)
        }}
        onBlur={() => setOpen(false)}
      />

      {open ? (
        <div
          id={`${id}-suggestions`}
          role="listbox"
          className="absolute top-full z-[100] mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-zinc-300 bg-white p-1 shadow-lg"
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100",
                  index === activeIndex && "bg-zinc-100"
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option.value)}
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-zinc-500">{noResultsText}</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
