"use client";

import styles from "./InputSelectMultiple.module.css";
import { useEffect, useReducer, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import sortByInitialLetter from "@/utils/sortByInitialLetter";
import Delete from "@/assets/img/icons/Delete.svg";
import Down from "@/assets/img/icons/Down.svg";

type Option = { value: string; label: string };

const reducer = (state: Option[], action: "" | Option) => {
  if (action === "") {
    return [];
  }
  const exists = state.some((el) => el.value === action.value);
  if (exists) {
    return state.filter((el) => el.value !== action.value);
  }
  return [...state, action];
};

export default function InputSelectMultiple({
  labelText,
  options,
  defaultSelected,
  disabledElements,
  disabledText = "Not available",
  onChange,
  sortOptions,
}: {
  labelText?: string;
  options: string[] | Option[];
  defaultSelected?: string[];
  disabledElements?: string[];
  disabledText?: string;
  onChange?: React.Dispatch<React.SetStateAction<Option[]>>;
  sortOptions?: boolean;
}) {
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const sortedOptions = sortOptions
    ? [...normalizedOptions].sort(sortByInitialLetter)
    : normalizedOptions;

  const inputText = useRef<HTMLInputElement>(null);
  const optionsList = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(
    reducer,
    defaultSelected || [],
    (initial) => normalizedOptions.filter((opt) => initial.includes(opt.value))
  );
  const [searchInput, setSearchInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [menuOriginTop, setMenuOriginTop] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        showOptions &&
        !optionsList.current?.contains(event.target as Node) &&
        !inputText.current?.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showOptions]);

  useEffect(() => {
    if (onChange) {
      onChange(state);
    }
  }, [onChange, state]);

  function handlePointerDown(event: React.PointerEvent) {
    event.preventDefault();

    if (event.clientY > window.innerHeight * 0.5) {
      setMenuOriginTop(true);
    } else {
      setMenuOriginTop(false);
    }
    setShowOptions((prev) => !prev);
    requestAnimationFrame(() => {
      inputText.current?.focus();
    });
  }

  function handleInputFocus(event: React.FocusEvent) {
    if (
      event.currentTarget.getBoundingClientRect().y >
      window.innerHeight * 0.5
    ) {
      setMenuOriginTop(true);
    } else {
      setMenuOriginTop(false);
    }
    setShowOptions(true);
  }

  function handleEscapeKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (setShowOptions && event.key === "Escape") {
      setShowOptions(false);
    }
  }

  return (
    <div className={styles.InputSelectMultiple} onKeyDown={handleEscapeKeyDown}>
      <div className={styles.InputContainer}>
        <input
          ref={inputText}
          type={"text"}
          placeholder="."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPointerDown={handlePointerDown}
          onFocus={handleInputFocus}
        />
        <label>{labelText}</label>
        {searchInput ? (
          <button
            type="button"
            className={styles.ClearButton}
            onClick={() => setSearchInput("")}
          >
            <Delete />
          </button>
        ) : (
          <span className={styles.Arrow}>
            <Down />
          </span>
        )}

        <div
          className={[
            styles.SelectedContainer,
            state.length > 0 && styles.SelectedContainerShow,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {state.map((option) => (
            <span key={"selected-" + option.label}>
              <Button onClick={() => dispatch(option)}>✖</Button>
              {option.label}
            </span>
          ))}

          <button
            type="button"
            className={styles.ClearButton}
            onClick={() => dispatch("")}
          >
            <Delete />
          </button>
        </div>
      </div>

      <div
        ref={optionsList}
        className={[
          styles.OptionsList,
          showOptions && styles.OptionsListOpen,
          menuOriginTop && styles.OptionsListFromTop,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {sortedOptions.map((option) => (
          <label
            key={"option-" + option.value}
            style={{
              display: option.label
                .toUpperCase()
                .includes(searchInput.toUpperCase())
                ? "flex"
                : "none",
            }}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={state.some((el) => el.value === option.value)}
              onChange={() => dispatch(option)}
              disabled={disabledElements?.includes(option.value)}
            />
            {option.label}
            {disabledElements?.includes(option.value)
              ? " - " + disabledText
              : ""}
          </label>
        ))}
      </div>
    </div>
  );
}
