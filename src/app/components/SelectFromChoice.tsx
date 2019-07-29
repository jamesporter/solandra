import React from "react";

type SelectFromChoiceProps<T> = {
  value: T;
  choices: { label: string; value: T }[];
  onSelect: (choice: T) => void;
  tailwindContainerClasses?: string;
};

export default function SelectFromChoice<T>({
  value,
  choices,
  onSelect,
  tailwindContainerClasses = ""
}: SelectFromChoiceProps<T>) {
  return (
    <div className={`flex flex-row ${tailwindContainerClasses}`}>
      {choices.map(({ label, value: v }, i) => {
        const colour = v == value ? "teal" : "gray";
        return (
          <button
            key={i}
            className={`bg-${colour}-500 hover:bg-${colour}-600 focus:outline-none focus:shadow-outline px-2 py-1 rounded mx-1`}
            onClick={() => onSelect(v)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
