"use client";

import styles from "./Menu.module.css";
import { useEffect, useRef, useState } from "react";
import Card from "@/components/Card/Card";
import Down from "@/assets/img/icons/Down.svg";

export default function Menu({
  label = "Menu",
  children,
  menuWidth = "fit-content",
  menuMaxHeight = "50vh",
  asText,
}: {
  label?: React.ReactNode | string;
  children?: React.ReactNode;
  menuWidth?: string;
  menuMaxHeight?: string;
  asText?: boolean;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [menuOriginTop, setMenuOriginTop] = useState(false);
  const [menuOriginRight, setMenuOriginRight] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function handleClickToPosition(event: React.MouseEvent) {
    if (event.clientX > window.innerWidth * 0.5) {
      setMenuOriginRight(true);
    } else {
      setMenuOriginRight(false);
    }
    if (event.clientY > window.innerHeight * 0.5) {
      setMenuOriginTop(true);
    } else {
      setMenuOriginTop(false);
    }
  }

  function handleEscapeKeyDown(event: React.KeyboardEvent<HTMLDetailsElement>) {
    if (detailsRef.current?.open && event.key === "Escape") {
      detailsRef.current.open = false;
    }
  }

  return (
    <details
      ref={detailsRef}
      className={styles.DetailsContainer}
      onKeyDown={handleEscapeKeyDown}
    >
      <summary
        className={[
          styles.DetailsSummary,
          asText && styles.DetailsSummaryAsText,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleClickToPosition}
      >
        {label}
        <Down className={styles.DetailsSummaryArrow} />
      </summary>

      <Card
        className={[
          styles.MenuContainer,
          menuOriginRight && styles.MenuFromRight,
          menuOriginTop && styles.MenuFromTop,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <menu
          className={styles.Menu}
          style={{
            width: menuWidth,
            maxHeight: menuMaxHeight,
          }}
        >
          {children}
        </menu>
      </Card>
    </details>
  );
}

export function SubMenu({
  label = "Menu",
  children,
}: {
  label?: React.ReactNode | string;
  children?: React.ReactNode;
}) {
  return (
    <li>
      <details className={styles.SubMenu}>
        <summary className={styles.SubMenuSummary}>
          {label}
          <Down className={styles.DetailsSummaryArrow} />
        </summary>
        <menu>{children}</menu>
      </details>
    </li>
  );
}
