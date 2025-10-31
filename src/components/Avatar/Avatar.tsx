import styles from "./Avatar.module.css";
import User from "@/assets/img/icons/User.svg";

export default function Avatar({
  size,
  name,
  imgURL,
  color,
}: {
  size?: string;
  name?: string;
  imgURL?: string;
  color?: string;
}) {
  const randomColor =
    "#" +
    Math.floor(Math.random() * 8).toString(16) +
    Math.floor(Math.random() * 8).toString(16) +
    Math.floor(Math.random() * 8).toString(16);

  return (
    <span
      className={styles.Avatar}
      style={
        {
          "--size": size,
          backgroundColor: color ? color : randomColor,
        } as React.CSSProperties
      }
    >
      {imgURL ? (
        <img alt={name + " avatar"} src={imgURL} />
      ) : name ? (
        <span>{name.charAt(0)}</span>
      ) : (
        <User />
      )}
    </span>
  );
}
