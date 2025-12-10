import styles from "./InputRadio.module.css";

export default function InputRadio({
  labelText,
  inline,
  size,
  ...props
}: {
  labelText?: string;
  inline?: boolean;
  size?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={[styles.InputRadio, inline && styles.InputRadioInline]
        .filter(Boolean)
        .join(" ")}
      style={{ "--size": size } as React.CSSProperties}
    >
      <input type="radio" {...props} />
      {labelText}
    </label>
  );
}
