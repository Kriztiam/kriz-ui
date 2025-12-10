import getInitialLetter from "./getInitialLetter";

export default function sortByInitialLetter(
  a: { value: string; label: string },
  b: { value: string; label: string }
) {
  const initialLetterA = getInitialLetter(a.label);
  const initialLetterB = getInitialLetter(b.label);
  if (initialLetterA === "*") return -1;
  if (initialLetterB === "*") return 1;
  if (initialLetterA === "0-9") return -1;
  if (initialLetterB === "0-9") return 1;
  return initialLetterA.localeCompare(initialLetterB);
}
