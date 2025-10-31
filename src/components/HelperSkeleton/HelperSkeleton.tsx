import styles from "./HelperSkeleton.module.css";

export default function HelperSkeleton({
  width = "100%",
  height = "100%",
  radius = "2px",
  color = "hsla(var(--fontColor),0.25)",
  text,
}: {
  width?: string;
  height?: string;
  radius?: string;
  color?: string;
  text?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}) {
  const textHeights = {
    h1: "var(--fontSize1000)",
    h2: "var(--fontSize900)",
    h3: "var(--fontSize800)",
    h4: "var(--fontSize700)",
    h5: "var(--fontSize600)",
    h6: "var(--fontSize500)",
    p: "var(--fontSize400)",
  };
  return (
    <div
      className={styles.Skeleton}
      style={{
        width: width,
        height: text ? textHeights[text] : height,
        borderRadius: radius,
        backgroundColor: color,
        margin: "0.25rem 0",
      }}
    />
  );
}
