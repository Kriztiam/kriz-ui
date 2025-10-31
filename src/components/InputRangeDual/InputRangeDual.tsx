"use client";

import styles from "./InputRangeDual.module.css";
import { useId, useState } from "react";

export default function InputRangeDual({
  labelText,
  id,
  min = 0,
  max = 100,
  step,
  initialValueMin,
  initialValueMax,
  valuePrefix = "",
  valueSuffix = "",
}: {
  labelText: string;
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  initialValueMin?: number;
  initialValueMax?: number;
  valuePrefix?: string;
  valueSuffix?: string;
}) {
  const uniqueId = useId();
  const [valueMin, setValueMin] = useState(initialValueMin ?? min);
  const [valueMax, setValueMax] = useState(initialValueMax ?? max);

  function correctMinMax() {
    if (valueMin > valueMax) {
      setValueMax(valueMin);
      setValueMin(valueMax);
    }
  }

  return (
    <div
      className={styles.Range}
      style={
        {
          "--positionValueMin": ((valueMin - min) / (max - min)) * 100 + "%",
          "--positionValueMax": ((valueMax - min) / (max - min)) * 100 + "%",
        } as React.CSSProperties
      }
    >
      <label htmlFor={id ? id + "Min" : uniqueId + "Min"}>{labelText}</label>
      <output>
        {`${valuePrefix}${valueMin}${valueSuffix}`}
        {" - "}
        {`${valuePrefix}${valueMax}${valueSuffix}`}
      </output>
      <div className={styles.RangeDual}>
        <input
          id={id ? id + "Min" : uniqueId + "Min"}
          className={styles.RangeInput}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => setValueMin(parseFloat(e.target.value))}
          onPointerUp={correctMinMax}
          onTouchEnd={correctMinMax}
          onBlur={correctMinMax}
        />
        <input
          id={id ? id + "Max" : uniqueId + "Max"}
          className={styles.RangeInput}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => setValueMax(parseFloat(e.target.value))}
          onPointerUp={correctMinMax}
          onTouchEnd={correctMinMax}
          onBlur={correctMinMax}
        />
      </div>
      <div className={styles.RangeMinMax}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
