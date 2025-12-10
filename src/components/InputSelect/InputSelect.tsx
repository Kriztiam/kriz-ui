import styles from "./InputSelect.module.css";
import { useId } from "react";
import getInitialLetter from "@/utils/getInitialLetter";
import sortByInitialLetter from "@/utils/sortByInitialLetter";
import Down from "@/assets/img/icons/Down.svg";

export default function InputSelect({
  labelText,
  options,
  optionsGroups,
  defaultSelected,
  disabledElements,
  disabledText = "Not available",
  ...props
}: {
  labelText?: string;
  options: string[] | { value: string; label: string }[];
  optionsGroups?: boolean;
  defaultSelected?: string;
  disabledElements?: string[];
  disabledText?: string;
} & React.InputHTMLAttributes<HTMLSelectElement>) {
  const normalizedOptions: { value: string; label: string }[] = options.map(
    (opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)
  );

  const sortedOptions = [...normalizedOptions].sort(sortByInitialLetter);

  function getOptionsGroups(options: { value: string; label: string }[]) {
    const optionsGroupsMap = new Map<string, React.JSX.Element[]>();
    options.forEach((option) => {
      const initialLetter = getInitialLetter(option.label);
      if (!optionsGroupsMap.has(initialLetter)) {
        optionsGroupsMap.set(initialLetter, []);
      }
      optionsGroupsMap.get(initialLetter)!.push(
        <option
          key={"select" + option.value}
          value={option.value}
          disabled={disabledElements?.includes(option.value)}
        >
          {option.label}
          {disabledElements?.includes(option.value) ? " - " + disabledText : ""}
        </option>
      );
    });

    return Array.from(optionsGroupsMap.entries());
  }

  const uniqueId = useId();

  return (
    <div className={styles.InputContainer}>
      <select
        id={props.id ? props.id : uniqueId}
        required
        defaultValue={defaultSelected ?? ""}
        {...props}
      >
        <option
          value=""
          disabled={disabledElements?.includes("")}
          hidden={disabledElements?.includes("")}
        >
           
        </option>
        {optionsGroups
          ? getOptionsGroups(sortedOptions).map(([groupLabel, options]) => (
              <optgroup key={"optgroup-" + groupLabel} label={groupLabel}>
                {options}
              </optgroup>
            ))
          : normalizedOptions.map((option) => (
              <option
                key={"option-" + option.value}
                value={option.value}
                disabled={disabledElements?.includes(option.value)}
              >
                {option.label}
                {disabledElements?.includes(option.value)
                  ? " - " + disabledText
                  : ""}
              </option>
            ))}
      </select>
      <label htmlFor={props.id ? props.id : uniqueId}>{labelText}</label>
      <Down />
    </div>
  );
}
