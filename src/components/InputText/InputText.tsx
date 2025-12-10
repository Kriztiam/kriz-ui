"use client";

import styles from "./InputText.module.css";
import { useId, useRef, useState } from "react";
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
  labelText,
  ...props
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
  labelText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const withIcon = type === "search" || type === "email" || type === "password";
  const showCalendarPicker =
    type === "date" ||
    type === "datetime-local" ||
    type === "month" ||
    type === "time" ||
    type === "week";
  const uniqueId = useId();
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
        id={props.id ? props.id : uniqueId}
        type={type === "password" && showPassword ? "text" : type}
        placeholder={
          ["text", "search", "email", "password", "number"].includes(type)
            ? "."
            : undefined
        }
        {...props}
      />
      <label htmlFor={props.id ? props.id : uniqueId}>{labelText}</label>

      {type === "search" && (
        <button
          type="button"
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
          type="button"
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
            type="button"
            className={styles.InputButton}
            onClick={() => inputRef.current?.stepDown()}
            title="Decrease value"
            aria-label="Decrease value"
          >
            <Minus />
          </button>
          <span />
          <button
            type="button"
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
          type="button"
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
