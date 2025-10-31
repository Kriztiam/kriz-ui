import styles from "./InputColor.module.css";
import { useId } from "react";

export default function InputColor({
  listOptions,
  listId,
  ...props
}: {
  listOptions?: string[];
  listId?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const uniqueListId = useId();
  return (
    <>
      <input
        type="color"
        className={styles.InputColor}
        list={listOptions && listId ? listId : uniqueListId}
        {...props}
      />

      {listOptions && (
        <datalist id={listId ? listId : uniqueListId}>
          {listOptions.map((option, idx) => (
            <option key={idx} value={option} />
          ))}
        </datalist>
      )}
    </>
  );
}
