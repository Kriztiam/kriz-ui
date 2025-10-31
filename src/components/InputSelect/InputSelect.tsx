import styles from "./InputSelect.module.css";
import Down from "@/assets/img/icons/Down.svg";

export default function InputSelect({
  id,
  labelText,
  options,
  optionsGroups,
  defaultSelected,
  disabledElements,
  disabledText = "Not available",
  onChange,
}: {
  id?: string;
  labelText?: string;
  options: string[] | { value: string; label: string }[];
  optionsGroups?: boolean;
  defaultSelected?: string;
  disabledElements?: string[];
  disabledText?: string;
  onChange?: (value: string) => void;
}) {
  function getInitialLetter(str: string) {
    if (isNaN(Number(str.charAt(0))) && !/[a-zA-Z]/.test(str.charAt(0))) {
      return "*";
    } else if (isNaN(Number(str.charAt(0)))) {
      return str.charAt(0);
    } else {
      return "0-9";
    }
  }

  function sortByInitialLetter(
    a: { value: string; label: string },
    b: { value: string; label: string }
  ) {
    const initialLetterA = getInitialLetter(a.label);
    const initialLetterB = getInitialLetter(b.label);
    if (initialLetterA === "*") return -1;
    if (initialLetterB === "*") return 1;
    if (initialLetterA === "0-9") return -1;
    if (initialLetterB === "0-9") return 1;
    return initialLetterA.localeCompare(initialLetterB);
  }

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

  return (
    <div className={styles.InputContainer}>
      <select
        id={id}
        name={id}
        required
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        defaultValue={defaultSelected ?? ""}
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
          : sortedOptions.map((option) => (
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
      <label htmlFor={id}>{labelText || id}</label>
      <Down />
    </div>
  );
}
