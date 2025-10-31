"use client";

import styles from "./Pagination.module.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnimationLoading from "@/components/AnimationLoading/AnimationLoading";
import Button from "@/components/Button/Button";
import First from "@/assets/img/icons/First.svg";
import Last from "@/assets/img/icons/Last.svg";
import Left from "@/assets/img/icons/Left.svg";
import Right from "@/assets/img/icons/Right.svg";

function generateButtonsArray(
  visibleButtonCount: number,
  maxPages: number,
  selectedPage: number
) {
  const half = Math.floor(visibleButtonCount * 0.5);
  let start = Math.max(1, selectedPage - half);
  let end = start + visibleButtonCount - 1;

  if (end > maxPages) {
    end = maxPages;
    start = Math.max(1, end - visibleButtonCount + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({
  maxPages = 10,
  defaultPage = 1,
  hideNextButton = false,
  hideLastButton = false,
  size,
  getCurrentPage,
}: {
  maxPages?: number;
  defaultPage?: number;
  hideNextButton?: boolean;
  hideLastButton?: boolean;
  size?: string;
  getCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const paginationContainerRef = useRef<HTMLDivElement>(null);
  const [buttonsArray, setButtonsArray] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState(
    defaultPage <= maxPages ? defaultPage : 1
  );

  useLayoutEffect(() => {
    const updatePaginationLayout = () => {
      if (!paginationContainerRef.current) return;

      const parentElement = paginationContainerRef.current?.parentElement;
      if (!parentElement) return;
      const parentRect = parentElement.getBoundingClientRect();
      const parentStyles = getComputedStyle(parentElement);
      const paddingLeft = parseFloat(parentStyles.paddingLeft);
      const paddingRight = parseFloat(parentStyles.paddingRight);
      const borderLeft = parseFloat(parentStyles.borderLeftWidth);
      const borderRight = parseFloat(parentStyles.borderRightWidth);

      const availableWidth =
        parentRect.width -
        paddingLeft -
        paddingRight -
        borderLeft -
        borderRight;

      const buttonWidth =
        paginationContainerRef.current.children[0].getBoundingClientRect()
          .width;

      const maxButtonCount = Math.floor(availableWidth / buttonWidth);
      const extraButtons = (hideNextButton ? 0 : 2) + (hideLastButton ? 0 : 2);
      const visibleButtonCount = Math.max(1, maxButtonCount - extraButtons);

      setButtonsArray(
        generateButtonsArray(visibleButtonCount, maxPages, selectedPage)
      );
    };

    updatePaginationLayout();

    window.addEventListener("resize", updatePaginationLayout);
    return () => {
      window.removeEventListener("resize", updatePaginationLayout);
    };
  }, [maxPages, selectedPage, hideNextButton, hideLastButton]);

  useEffect(() => {
    if (getCurrentPage) {
      getCurrentPage(selectedPage);
    }
  }, [getCurrentPage, selectedPage]);

  return (
    <menu
      ref={paginationContainerRef}
      className={styles.Pagination}
      style={{ "--size": size } as React.CSSProperties}
    >
      {!hideLastButton && (
        <li>
          <Button
            onClick={() => setSelectedPage(1)}
            disabled={selectedPage <= 1}
            outline
          >
            <First />
          </Button>
        </li>
      )}
      {!hideNextButton && (
        <li>
          <Button
            onClick={() =>
              setSelectedPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
            }
            disabled={selectedPage <= 1}
            outline
          >
            <Left />
          </Button>
        </li>
      )}

      {buttonsArray.length === 0 ? (
        <li>
          <Button>
            <AnimationLoading color="hsl(var(--colorBackground))" />
          </Button>
        </li>
      ) : (
        buttonsArray.map((buttonNumber) => (
          <li key={"PaginationButton" + buttonNumber}>
            <Button
              outline={!(selectedPage === buttonNumber)}
              onClick={() => setSelectedPage(buttonNumber)}
            >
              {buttonNumber}
            </Button>
          </li>
        ))
      )}

      {!hideNextButton && (
        <li>
          <Button
            onClick={() =>
              setSelectedPage((prev) =>
                prev + 1 < maxPages ? prev + 1 : maxPages
              )
            }
            disabled={selectedPage >= maxPages}
            outline
          >
            <Right />
          </Button>
        </li>
      )}
      {!hideLastButton && (
        <li>
          <Button
            onClick={() => setSelectedPage(maxPages)}
            disabled={selectedPage >= maxPages}
            outline
          >
            <Last />
          </Button>
        </li>
      )}
    </menu>
  );
}
