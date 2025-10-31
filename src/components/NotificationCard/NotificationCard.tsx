import styles from "./NotificationCard.module.css";
import AnimationText from "@/components/AnimationText/AnimationText";
import Check from "@/assets/img/icons/Check.svg";
import Error from "@/assets/img/icons/Error.svg";
import Info from "@/assets/img/icons/Info.svg";
import Warning from "@/assets/img/icons/Warning.svg";

const typeConfig = {
  info: { label: "Info", color: "var(--colorInfo)", icon: <Info /> },
  success: {
    label: "Success",
    color: "var(--colorSuccess)",
    icon: <Check />,
  },
  warning: {
    label: "Warning",
    color: "var(--colorWarning)",
    icon: <Warning />,
  },
  error: { label: "Error", color: "var(--colorError)", icon: <Error /> },
  normal: { label: "", color: undefined, icon: null },
} as const;

type NotificationType = keyof typeof typeConfig;

export default function NotificationCard({
  type = "normal",
  notificationTypeLabel = "",
  notificationTitle = "Notification",
  fullScreen,
  children,
  className,
  ...props
}: {
  type?: NotificationType;
  notificationTypeLabel?: string;
  notificationTitle?: string;
  fullScreen?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { label, color, icon } = typeConfig[type];
  return (
    <div
      className={[
        styles.NotificationCard,
        fullScreen && styles.NotificationCardFullscreen,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--notificationColor": color } as React.CSSProperties}
    >
      <div className={styles.NotificationCardHeader}>
        {icon && (
          <div className={styles.NotificationCardHeaderIcon}>
            {icon}
            {notificationTypeLabel ? notificationTypeLabel : label}
          </div>
        )}
        <h1>
          <AnimationText speed={40}>{notificationTitle}</AnimationText>
        </h1>
      </div>

      <div
        className={[styles.NotificationCardChildren, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
