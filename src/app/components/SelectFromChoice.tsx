import React from "react"

type SelectFromChoiceProps<T> = {
  value: T
  choices: { label: string; value: T }[]
  onSelect: (choice: T) => void
  tailwindContainerClasses?: string
  tailwindItemContainerClasses?: string
}

export default function SelectFromChoice<T>({
  value,
  choices,
  onSelect,
  tailwindContainerClasses = "",
  tailwindItemContainerClasses = "",
}: SelectFromChoiceProps<T>) {
  return (
    <div className={`flex flex-row flex-wrap ${tailwindContainerClasses}`}>
      {choices.map(({ label, value: v }, i) => {
        const colour = v == value ? "teal" : "gray"
        return (
          <button
            key={i}
            className={`bg-${colour}-500 hover:bg-${colour}-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded mx-1 ${tailwindItemContainerClasses}`}
            onClick={() => onSelect(v)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
