import React from "react";

type SelectOptionProps = {
  options: string[];
  selection: string | null;
  onSelect: (option: string) => void;
};

export default function SelectOption({
  options,
  selection,
  onSelect
}: SelectOptionProps) {
  return (
    <select
      className="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 w-40"
      onChange={evt => onSelect(evt.target.value)}
      value={selection || ""}
    >
      {options.map((opt, i) => (
        <option value={opt} key={i}>
          {opt}
        </option>
      ))}
    </select>
  );
}
