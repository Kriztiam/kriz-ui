import styles from "./InputCheckbox.module.css";

export default function InputCheckbox({
  size,
  labelText,
  ...props
}: {
  size?: string;
  labelText?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={styles.Checkbox}
      style={{ "--size": size } as React.CSSProperties}
    >
      <input type="checkbox" {...props} />
      {labelText}
      <span />
    </label>
  );
}
