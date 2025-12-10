export default function getInitialLetter(str: string) {
  if (isNaN(Number(str.charAt(0))) && !/[a-zA-Z]/.test(str.charAt(0))) {
    return "*";
  } else if (isNaN(Number(str.charAt(0)))) {
    return str.charAt(0);
  } else {
    return "0-9";
  }
}
