"use client";

import styles from "./InputSelectMultiple.module.css";
import { useEffect, useReducer, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import Delete from "@/assets/img/icons/Delete.svg";
import Down from "@/assets/img/icons/Down.svg";

function getInitialLetter(str: string) {
  if (isNaN(Number(str.charAt(0))) && !/[a-zA-Z]/.test(str.charAt(0))) {
    return "*";
  } else if (isNaN(Number(str.charAt(0)))) {
    return str.charAt(0);
  } else {
    return "0-9";
  }
}

function sortByInitialLetter(a: string, b: string) {
  const initialLetterA = getInitialLetter(a);
  const initialLetterB = getInitialLetter(b);
  if (initialLetterA === "*") return -1;
  if (initialLetterB === "*") return 1;
  if (initialLetterA === "0-9") return -1;
  if (initialLetterB === "0-9") return 1;
  return initialLetterA.localeCompare(initialLetterB);
}

const reducer = (state: string[], action: string) => {
  if (action === "") {
    return [];
  }
  if (state.includes(action)) {
    return [...state.filter((element: string) => element !== action)];
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
}: {
  labelText?: string;
  options: string[];
  defaultSelected?: string[];
  disabledElements?: string[];
  disabledText?: string;
  onChange?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const sortedOptions = options.sort(sortByInitialLetter);

  const inputText = useRef<HTMLInputElement>(null);
  const optionsList = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(reducer, defaultSelected || []);
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

  function handleInputClick(event: React.MouseEvent) {
    if (event.clientY > window.innerHeight * 0.5) {
      setMenuOriginTop(true);
    } else {
      setMenuOriginTop(false);
    }
    setShowOptions(true);
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
          onClick={handleInputClick}
          onFocus={handleInputFocus}
        />
        <label>{labelText}</label>
        {searchInput ? (
          <button
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
          {state.map((element) => (
            <span key={"selected-" + element}>
              <Button onClick={() => dispatch(element)}>✖</Button>
              {element}
            </span>
          ))}

          <button className={styles.ClearButton} onClick={() => dispatch("")}>
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
        {sortedOptions.map((element) => (
          <label
            key={"option-" + element}
            style={{
              display: element.toUpperCase().includes(searchInput.toUpperCase())
                ? "flex"
                : "none",
            }}
          >
            <input
              type="checkbox"
              checked={state.includes(element)}
              onChange={() => dispatch(element)}
              disabled={disabledElements?.includes(element)}
            />
            {element}
            {disabledElements?.includes(element) ? " - " + disabledText : ""}
          </label>
        ))}
      </div>
    </div>
  );
}
