import React from "react"

type SelectFromChoiceProps<T> = {
  value: T
  choices: { label: string; value: T }[]
  onSelect: (choice: T) => void
}

export default function SelectFromChoice<T>({
  value,
  choices,
  onSelect,
}: SelectFromChoiceProps<T>) {
  return (
    <div className={`flex flex-row flex-wrap gap-2`}>
      {choices.map(({ label, value: v }, i) => {
        return (
          <button
            key={i}
            className={
              v == value
                ? "bg-sky-200 text-sky-950 p-2 rounded-lg dark:bg-sky-400"
                : "bg-gray-200 text-gray-900 p-2 rounded-lg hover:bg-sky-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-sky-600"
            }
            onClick={() => onSelect(v)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
