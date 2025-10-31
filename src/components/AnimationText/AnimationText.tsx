"use client";

import { useEffect, useRef, useState } from "react";

const LETTERS_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTERS_LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!#&+-/=?@[]_.";

function toRandomLetter(letter: string) {
  const charCode = letter.charCodeAt(0);
  const randomIndex = Math.floor(Math.random() * 26);

  if (charCode >= 65 && charCode <= 90) return LETTERS_UPPER[randomIndex];
  if (charCode >= 97 && charCode <= 122) return LETTERS_LOWER[randomIndex];
  if (charCode >= 48 && charCode <= 57) {
    return NUMBERS[randomIndex % NUMBERS.length];
  }
  if (charCode === 32) return " ";
  return SYMBOLS[randomIndex % SYMBOLS.length];
}

export function useTextAnimation(
  originalText: string,
  trigger: boolean,
  speed = 20
) {
  const [displayText, setDisplayText] = useState(originalText);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    let iteration = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((letter, index) => {
            if (index < iteration) return originalText[index];
            return toRandomLetter(letter);
          })
          .join("")
      );

      iteration++;

      if (iteration > originalText.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDisplayText(originalText);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [originalText, trigger, speed]);

  return displayText;
}

/** The animation triggers when the element are visible in the viewport. To avoid jumps in text use monospace fonts. */
export default function AnimationText({
  children,
  speed = 15,
  triggerOnce,
  ...props
}: {
  children: string;
  speed?: number;
  triggerOnce?: boolean;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [trigger, setTrigger] = useState(false);
  const displayText = useTextAnimation(children, trigger, speed);

  useEffect(() => {
    if (!spanRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrigger(true);
          if (triggerOnce) observer.unobserve(entry.target);
        } else {
          setTrigger(false);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(spanRef.current);
    return () => observer.disconnect();
  }, [spanRef, trigger, triggerOnce]);

  return (
    <span ref={spanRef} {...props}>
      {displayText}
    </span>
  );
}
