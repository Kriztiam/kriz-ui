import styles from "./AnimationLoading.module.css";

export default function AnimationLoading({
  size,
  color,
  fullScreen = false,
}: {
  size?: string;
  color?: string;
  fullScreen?: boolean;
}) {
  const content = (
    <span
      className={styles.Loading}
      style={{ "--size": size, "--color": color } as React.CSSProperties}
    >
      <span />
      <span />
      <span />
      <span />
    </span>
  );

  return fullScreen ? (
    <div className={styles.LoadingFullScreen}>{content}</div>
  ) : (
    content
  );
}
