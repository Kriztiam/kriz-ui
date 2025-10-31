"use client";

import styles from "./Drawer.module.css";
import { useEffect, useRef } from "react";
import Button from "@/components/Button/Button";
import X from "@/assets/img/icons/X.svg";

export default function Drawer({
  isOpen = true,
  setIsOpen,
  fixed,
  fromRight,
  children,
}: {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  fixed?: boolean;
  fromRight?: boolean;
  children?: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (fixed) {
        dialog.current?.showModal();
      } else {
        dialog.current?.show();
      }
    } else {
      dialog.current?.close();
    }
  }, [isOpen, fixed]);

  function handleClickInBackdrop(event: React.MouseEvent) {
    if (setIsOpen && dialog.current) {
      const rect = dialog.current.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        setIsOpen(false);
      }
    }
  }

  function handleEscapeKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (setIsOpen && isOpen && event.key === "Escape") {
      setIsOpen(false);
    }
  }

  if (setIsOpen) {
    return (
      <dialog
        ref={dialog}
        className={[
          styles.Drawer,
          styles.DrawerDialog,
          fixed && styles.DrawerFixed,
          fromRight && styles.DrawerFromRight,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleClickInBackdrop}
        onKeyDown={handleEscapeKeyDown}
      >
        <Button onClick={() => setIsOpen(false)} outline>
          <X />
        </Button>
        <div>{children}</div>
      </dialog>
    );
  }

  return (
    <aside className={styles.Drawer} onKeyDown={handleEscapeKeyDown}>
      {children}
    </aside>
  );
}
