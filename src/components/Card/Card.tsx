import styles from "./Card.module.css";

export default function Card({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.Card, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
