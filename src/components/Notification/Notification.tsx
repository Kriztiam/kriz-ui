import styles from "./Notification.module.css";
import { useEffect } from "react";
import Check from "@/assets/img/icons/Check.svg";
import Error from "@/assets/img/icons/Error.svg";
import Info from "@/assets/img/icons/Info.svg";
import Warning from "@/assets/img/icons/Warning.svg";

const typeConfig = {
  info: { color: "var(--colorInfo)", icon: <Info /> },
  success: {
    color: "var(--colorSuccess)",
    icon: <Check />,
  },
  warning: {
    color: "var(--colorWarning)",
    icon: <Warning />,
  },
  error: { color: "var(--colorError)", icon: <Error /> },
  normal: { color: undefined, icon: null },
} as const;

/** By default he notification appears visible in screen for a time of 2000ms + 75ms per character */
export default function Notification({
  type = "normal",
  message = "Notification",
  open,
  setOpen,
  visibleTime = Math.min(2000 + message.length * 75, 10000),
  fromBottom,
  position = "center",
  size,
}: {
  type?: "normal" | "info" | "success" | "warning" | "error";
  message?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  visibleTime?: number;
  fromBottom?: boolean;
  position?: "left" | "center" | "right";
  size?: string;
}) {
  const { color, icon } = typeConfig[type];

  useEffect(() => {
    if (open && setOpen) {
      const timer = setTimeout(() => setOpen(false), visibleTime);
      return () => clearTimeout(timer);
    }
  }, [open, setOpen, visibleTime]);

  return (
    <div
      className={[
        styles.Notification,
        open && styles.NotificationActive,
        fromBottom && styles.NotificationBottom,
        position === "left"
          ? styles.NotificationLeft
          : position === "right"
            ? styles.NotificationRight
            : undefined,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        { "--size": size, "--notificationColor": color } as React.CSSProperties
      }
    >
      {icon && <span className={styles.NotificationIcon}>{icon}</span>}
      <p>{message}</p>
    </div>
  );
}
