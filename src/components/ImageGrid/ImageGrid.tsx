"use client";

import styles from "./ImageGrid.module.css";
import { useEffect, useRef } from "react";
import ImageViewer from "@/components/ImageViewer/ImageViewer";

export default function ImageGrid({
  srcArray,
  altArray,
  thumbnailSrc,
  useNextImage,
  sizeEachImage,
}: {
  srcArray: string[];
  altArray?: string[];
  thumbnailSrc?: string[];
  useNextImage?: boolean;
  sizeEachImage?: string;
}) {
  const imagesGrid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imagesGrid.current) return;
    const observer = new ResizeObserver(() => {
      if (!imagesGrid.current) return;

      const gridColumns = window
        .getComputedStyle(imagesGrid.current)
        .getPropertyValue("grid-template-columns")
        .split(" ");

      imagesGrid.current.style.marginBottom = gridColumns[0];

      for (let i = 0; i < imagesGrid.current?.children.length; i++) {
        if (i % (gridColumns.length - 1) === 0) {
          imagesGrid.current?.children[i].classList.add(styles.CenterRow);
        } else {
          imagesGrid.current?.children[i].classList.remove(styles.CenterRow);
        }
      }
    });

    observer.observe(imagesGrid.current);
    return () => {
      observer.disconnect();
    };
  }, [imagesGrid]);

  return (
    <div
      ref={imagesGrid}
      className={styles.ImagesGridContainer}
      style={{ "--sizeEachImage": sizeEachImage } as React.CSSProperties}
    >
      {srcArray.map((imageSrc, i) => (
        <ImageViewer
          key={"ImageGrid" + i}
          src={imageSrc}
          alt={altArray ? altArray[i] : "ImageGrid image " + (i + 1)}
          thumbnailSrc={thumbnailSrc && thumbnailSrc[i]}
          useNextImage={useNextImage}
        />
      ))}
    </div>
  );
}
