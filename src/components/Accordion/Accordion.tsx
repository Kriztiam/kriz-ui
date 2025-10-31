import styles from "./Accordion.module.css";

export default function Accordion({
  label = "",
  open,
  groupName,
  color,
  children,
}: {
  label: string;
  open?: boolean;
  groupName?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <details
      className={styles.AccordionContainer}
      style={{ "--color": color } as React.CSSProperties}
      name={groupName}
      open={open}
    >
      <summary>
        <span className={styles.AccordionIcon} />
        {label}
      </summary>
      <div className={styles.AccordionSection}>{children}</div>
    </details>
  );
}
