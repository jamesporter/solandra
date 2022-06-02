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
                ? "bg-sky-200 p-2 rounded-lg "
                : "bg-gray-200 p-2 rounded-lg hover:bg-sky-400"
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
