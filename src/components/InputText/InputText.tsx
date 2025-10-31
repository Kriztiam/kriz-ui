"use client";

import styles from "./InputText.module.css";
import { useRef, useState } from "react";
import Calendar from "@/assets/img/icons/Calendar.svg";
import Clock from "@/assets/img/icons/Clock.svg";
import Delete from "@/assets/img/icons/Delete.svg";
import Eye from "@/assets/img/icons/Eye.svg";
import EyeSlash from "@/assets/img/icons/EyeSlash.svg";
import Key from "@/assets/img/icons/Key.svg";
import Mail from "@/assets/img/icons/Mail.svg";
import Minus from "@/assets/img/icons/Minus.svg";
import Plus from "@/assets/img/icons/Plus.svg";
import Search from "@/assets/img/icons/Search.svg";

export default function InputText({
  type = "text",
  id,
  labelText,
  defaultValue,
  onChange,
  autoFocus,
}: {
  type?:
    | "text"
    | "search"
    | "email"
    | "password"
    | "number"
    | "date"
    | "datetime-local"
    | "month"
    | "time"
    | "week";
  id?: string;
  labelText?: string;
  defaultValue?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const withIcon = type === "search" || type === "email" || type === "password";
  const showCalendarPicker =
    type === "date" ||
    type === "datetime-local" ||
    type === "month" ||
    type === "time" ||
    type === "week";
  return (
    <div
      className={[styles.InputContainer, withIcon && styles.InputWithIcon]
        .filter(Boolean)
        .join(" ")}
    >
      {withIcon && (
        <span className={styles.InputIcon}>
          {type === "search" && <Search />}
          {type === "email" && <Mail />}
          {type === "password" && <Key />}
        </span>
      )}

      <input
        ref={inputRef}
        type={type === "password" && showPassword ? "text" : type}
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={
          ["text", "search", "email", "password", "number"].includes(type)
            ? "."
            : undefined
        }
        autoFocus={autoFocus}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      <label htmlFor={id}>{labelText || id}</label>

      {type === "search" && (
        <button
          className={`${styles.InputButton} ${styles.InputButtonRight} ${styles.InputButtonSearch}`}
          onClick={() => {
            const input = inputRef.current;
            if (!input) return;
            input.value = "";
            const event = new Event("input", { bubbles: true });
            input.dispatchEvent(event);
          }}
        >
          <Delete />
        </button>
      )}
      {type === "password" && (
        <button
          className={`${styles.InputButton} ${styles.InputButtonRight}`}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye /> : <EyeSlash />}
        </button>
      )}
      {type === "number" && (
        <span
          className={`${styles.InputButtonRight} ${styles.InputButtonNumber}`}
        >
          <button
            className={styles.InputButton}
            onClick={() => inputRef.current?.stepDown()}
            title="Decrease value"
            aria-label="Decrease value"
          >
            <Minus />
          </button>
          <span />
          <button
            className={styles.InputButton}
            onClick={() => inputRef.current?.stepUp()}
            title="Increase value"
            aria-label="Increase value"
          >
            <Plus />
          </button>
        </span>
      )}
      {showCalendarPicker && (
        <button
          className={`${styles.InputButton} ${styles.InputButtonRight}`}
          onClick={() => {
            const input = inputRef.current;
            if (!input) return;
            if (input.showPicker) {
              input.showPicker();
            } else {
              input.focus();
            }
          }}
        >
          {type === "time" ? <Clock /> : <Calendar />}
        </button>
      )}
    </div>
  );
}
