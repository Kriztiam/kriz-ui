"use client";

import styles from "./SelectorTheme.module.css";
import { useCallback, useEffect, useRef } from "react";
import InputCheckbox from "@/components/InputCheckbox/InputCheckbox";
import InputColor from "@/components/InputColor/InputColor";
import Moon from "@/assets/img/icons/Moon.svg";
import Sun from "@/assets/img/icons/Sun.svg";
import { useThemeContext } from "@/context/ThemeContext";

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

export default function SelectorTheme({
  customColor,
}: {
  customColor?: boolean;
}) {
  const { theme, setTheme, themeColor, setThemeColor } = useThemeContext();

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setThemeColor(event.target.value);
    },
    [setThemeColor]
  );

  const debouncedHandlerRef = useRef(debounce(handleColorChange, 500));

  useEffect(() => {
    const handler = debouncedHandlerRef.current;
    return () => {
      handler.cancel();
    };
  }, []);

  return (
    <div className={styles.SelectorTheme}>
      <span className={styles.SwitchContainer}>
        <Moon className={styles.IconDark} />
        <InputCheckbox
          checked={theme === "light"}
          onChange={(e) =>
            e.target.checked ? setTheme("light") : setTheme("dark")
          }
        />
        <Sun className={styles.IconLight} />
      </span>

      {customColor && (
        <InputColor
          listOptions={[
            "#9b4b4b",
            "#746b3e",
            "#2e6b57",
            "#476e85",
            "#6e6379",
            "#815f7e",
            "#ffffff",
          ]}
          defaultValue={themeColor ? themeColor : undefined}
          onChange={(e) => {
            debouncedHandlerRef.current?.(e);
          }}
        />
      )}
    </div>
  );
}
