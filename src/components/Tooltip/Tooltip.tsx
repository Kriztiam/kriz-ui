"use client";

import styles from "./Tooltip.module.css";
import { useState } from "react";

export default function Tooltip({
  tooltipText,
  children,
}: {
  tooltipText: string;
  children: React.ReactNode;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipOriginTop, setTooltipOriginTop] = useState(false);
  const [tooltipOriginRight, setTooltipOriginRight] = useState(false);

  function handlePointerOver(event: React.MouseEvent) {
    if (event.clientX > window.innerWidth * 0.5) {
      setTooltipOriginRight(true);
    } else {
      setTooltipOriginRight(false);
    }
    if (event.clientY > window.innerHeight * 0.5) {
      setTooltipOriginTop(true);
    } else {
      setTooltipOriginTop(false);
    }
    setShowTooltip(true);
  }

  return (
    <div
      className={styles.TooltipContainer}
      onPointerOver={handlePointerOver}
      onPointerLeave={() => setShowTooltip(false)}
    >
      <span
        className={[
          styles.Tooltip,
          tooltipOriginRight && styles.TooltipFromRight,
          tooltipOriginTop && styles.TooltipFromTop,
          showTooltip && styles.TooltipActive,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {tooltipText}
      </span>
      {children}
    </div>
  );
}
