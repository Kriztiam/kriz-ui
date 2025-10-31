import styles from "./AnimationTextGradient.module.css";

export default function AnimationTextGradient({
  children,
  gradientBaseColor,
  gradientAccentColor,
  ...props
}: {
  children: React.ReactNode;
  gradientBaseColor?: string;
  gradientAccentColor?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={styles.TextGradient}
      style={
        {
          "--gradientBaseColor": gradientBaseColor,
          "--gradientAccentColor": gradientAccentColor,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </span>
  );
}
