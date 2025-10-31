"use client";

import styles from "./Button.module.css";
import { useNavigation } from "@/context/NavigationContext";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled,
  outline,
  href,
  target,
  size,
  color,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  outline?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
  size?: string;
  color?: string;
}) {
  const { Link } = useNavigation();
  if (href)
    return (
      <Link
        className={[
          styles.Button,
          outline ? styles.ButtonOutline : styles.ButtonSolid,
        ].join(" ")}
        href={href}
        onClick={onClick}
        target={target}
        style={{ "--size": size, "--color": color } as React.CSSProperties}
      >
        {children}
      </Link>
    );
  return (
    <button
      type={type}
      className={[
        styles.Button,
        outline ? styles.ButtonOutline : styles.ButtonSolid,
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
      style={{ "--size": size, "--color": color } as React.CSSProperties}
    >
      {children}
    </button>
  );
}
