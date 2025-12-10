"use client";

import styles from "./InputRange.module.css";
import { useId, useState } from "react";

export default function InputRange({
  labelText,
  min = 0,
  max = 100,
  initialValue,
  valuePrefix = "",
  valueSuffix = "",
  ...props
}: {
  labelText: string;
  min?: number;
  max?: number;
  initialValue?: number;
  valuePrefix?: string;
  valueSuffix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const uniqueId = useId();
  const defaultValue = max < min ? min : min + (max - min) * 0.5;
  const [value, setValue] = useState(initialValue ?? defaultValue);
  return (
    <div
      className={styles.Range}
      style={
        {
          "--positionValue": ((value - min) / (max - min)) * 100 + "%",
        } as React.CSSProperties
      }
    >
      <label htmlFor={props.id ? props.id : uniqueId}>{labelText}</label>
      <output>{`${valuePrefix}${value}${valueSuffix}`}</output>
      <input
        id={props.id ? props.id : uniqueId}
        className={styles.RangeInput}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        {...props}
      />
      <div className={styles.RangeMinMax}>
        <span>{`${valuePrefix}${min}${valueSuffix}`}</span>
        <span>{`${valuePrefix}${max}${valueSuffix}`}</span>
      </div>
    </div>
  );
}
