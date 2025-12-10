"use client";

import styles from "./ImageCarousel.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import ImageViewer from "@/components/ImageViewer/ImageViewer";
import Left from "@/assets/img/icons/Left.svg";
import Right from "@/assets/img/icons/Right.svg";

export default function ImageCarousel({
  srcArray,
  altArray,
  thumbnailSrc,
  useNextImage,
}: {
  srcArray: string[];
  altArray?: string[];
  thumbnailSrc?: string[];
  useNextImage?: boolean;
}) {
  const [img, setImg] = useState(0);
  const changeImgButtonsRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const nextImg = useCallback(() => {
    setImg((currentState) => {
      if (currentState < srcArray.length - 1) {
        return currentState + 1;
      } else {
        return 0;
      }
    });
  }, [srcArray.length]);

  const prevImg = useCallback(() => {
    setImg((currentState) => {
      if (currentState > 0) {
        return currentState - 1;
      } else {
        return srcArray.length - 1;
      }
    });
  }, [srcArray.length]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isMouseOver) return;
      e.preventDefault();
      if (e.deltaY > 0) {
        nextImg();
      } else {
        prevImg();
      }
    };

    const currentCarousel = changeImgButtonsRef.current;
    if (currentCarousel) {
      currentCarousel.addEventListener("wheel", handleWheel);
    }
    return () => {
      if (currentCarousel) {
        currentCarousel.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isMouseOver, prevImg, nextImg]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextImg();
      } else if (e.key === "ArrowLeft") {
        prevImg();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [prevImg, nextImg]);

  return (
    <div className={styles.ImageCarousel}>
      <div className={styles.CarouselImageContainer}>
        {srcArray.map((imageSrc, i) => (
          <ImageViewer
            key={"ImageGrid" + i}
            className={styles.CarouselImage}
            style={i !== img ? { display: "none" } : undefined}
            src={imageSrc}
            alt={altArray ? altArray[i] : "Carousel image " + (i + 1)}
            thumbnailSrc={thumbnailSrc && thumbnailSrc[i]}
            useNextImage={useNextImage}
          />
        ))}
      </div>

      {srcArray.length > 1 && (
        <div
          ref={changeImgButtonsRef}
          className={styles.ChangeImgButtons}
          onMouseEnter={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        >
          <Button outline onClick={prevImg}>
            <Left />
          </Button>

          <div className={styles.ItemImagesDotsContainer}>
            {srcArray.map((_, i) => (
              <button
                key={`buttonImage-${i}`}
                className={[
                  styles.ItemImagesDot,
                  img === i && styles.ItemImagesDotSelected,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setImg(i)}
              />
            ))}
          </div>

          <Button outline onClick={nextImg}>
            <Right />
          </Button>
        </div>
      )}
    </div>
  );
}
