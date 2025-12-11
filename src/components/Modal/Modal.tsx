"use client";

import styles from "./Modal.module.css";
import { useEffect, useRef } from "react";
import Right from "@/assets/img/icons/Right.svg";
import X from "@/assets/img/icons/X.svg";

export default function Modal({
  title,
  isOpen,
  setIsOpen,
  children,
  ...props
}: {
  title?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const modal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      modal.current?.showModal();
    } else {
      modal.current?.close();
    }
  }, [isOpen]);

  function handleClickOutsideDiv(event: React.MouseEvent) {
    const div = modal.current?.querySelector("div");
    if (setIsOpen && div && !div.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  return (
    <dialog
      ref={modal}
      className={styles.ModalContainer}
      onClick={handleClickOutsideDiv}
      onCancel={(e) => {
        e.preventDefault();
        setIsOpen?.(false);
      }}
    >
      <div
        className={[styles.Modal, props.className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className={styles.ModalTitle}>
          <span>
            <Right />
            {title}
          </span>
          <button
            className={styles.ModalButtonClose}
            onClick={() => setIsOpen && setIsOpen(false)}
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
