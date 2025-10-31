import styles from "./Divider.module.css";

export default function Divider({
  parentPadding,
  stylized,
  className,
  ...props
}: {
  parentPadding?: string;
  stylized?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLHRElement>) {
  if (stylized) {
    return (
      <div
        className={[
          styles.DividerStylized,
          parentPadding && styles.DividerMinusPadding,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
        style={
          {
            "--parentPadding": parentPadding,
            ...props.style,
          } as React.CSSProperties
        }
      >
        <span />
        <hr />
        <span />
      </div>
    );
  }
  return (
    <hr
      className={[
        styles.Divider,
        parentPadding && styles.DividerMinusPadding,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
      style={
        {
          "--parentPadding": parentPadding,
          ...props.style,
        } as React.CSSProperties
      }
    />
  );
}
