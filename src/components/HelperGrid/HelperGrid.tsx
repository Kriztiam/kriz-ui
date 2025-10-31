import styles from "./HelperGrid.module.css";

export default function HelperGrid({
  type = "div",
  className,
  style,
  columnsNumber,
  columnsMinSize,
  columnsMaxSize,
  fillEmptyColumns,
  gap,
  children,
}: {
  type?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  columnsNumber?: number;
  columnsMinSize?: string;
  columnsMaxSize?: string;
  fillEmptyColumns?: boolean;
  gap?: string;
  children?: React.ReactNode;
}) {
  const Element = type;
  return (
    <Element
      className={[styles.Grid, className].filter(Boolean).join(" ")}
      style={
        {
          style,
          "--gridColumnsNumber": columnsNumber,
          "--gridColumnsMinSize": columnsMinSize,
          "--gridColumnsMaxSize": columnsMaxSize,
          "--gridFillEmptyColumns": fillEmptyColumns && "auto-fit",
          "--gridGap": gap,
        } as React.CSSProperties
      }
    >
      {children}
    </Element>
  );
}
