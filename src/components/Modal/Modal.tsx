"use client";

import styles from "./Modal.module.css";
import { useEffect, useRef } from "react";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import X from "@/assets/img/icons/X.svg";

export default function Modal({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) {
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
      <Button
        outline
        onClick={() => setIsOpen && setIsOpen(false)}
        aria-label="Close modal"
      >
        <X />
      </Button>
      <Card className={styles.Modal}>{children}</Card>
    </dialog>
  );
}
