import styles from "./InputRadio.module.css";

export default function InputRadio({
  id,
  labelText,
  groupName,
  checked,
  disabled,
  inline,
  size,
}: {
  id?: string;
  labelText?: string;
  groupName?: string;
  checked?: boolean;
  disabled?: boolean;
  inline?: boolean;
  size?: string;
}) {
  return (
    <label
      className={[styles.InputRadio, inline && styles.InputRadioInline]
        .filter(Boolean)
        .join(" ")}
      style={{ "--size": size } as React.CSSProperties}
    >
      <input
        type="radio"
        id={id}
        name={groupName}
        value={labelText}
        checked={checked}
        disabled={disabled}
      />
      {labelText}
    </label>
  );
}
