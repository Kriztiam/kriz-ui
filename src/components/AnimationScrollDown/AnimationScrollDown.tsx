import styles from "./AnimationScrollDown.module.css";

export default function AnimationScrollDown({
  size,
  color,
}: {
  size?: string;
  color?: string;
}) {
  return (
    <div
      className={styles.ScrollDown}
      style={{ "--size": size, "--color": color } as React.CSSProperties}
    />
  );
}
