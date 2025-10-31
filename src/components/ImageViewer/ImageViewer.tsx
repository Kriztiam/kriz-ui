"use client";

import styles from "./ImageViewer.module.css";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import Expand from "@/assets/img/icons/Expand.svg";

export default function ImageViewer({
  className,
  style,
  src,
  alt,
  thumbnailSrc,
  size,
  useNextImage,
}: {
  className?: string;
  style?: React.CSSProperties;
  src: string;
  alt: string;
  thumbnailSrc?: string;
  size?: string;
  useNextImage?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={[styles.ImageViewerContainer, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <button
        className={styles.ImageViewerButton}
        style={{ "--size": size } as React.CSSProperties}
        onClick={() => setIsOpen(true)}
      >
        {useNextImage ? (
          <Image
            src={thumbnailSrc || src}
            alt={alt}
            layout="fill"
            objectFit="contain"
          />
        ) : (
          <img src={thumbnailSrc || src} alt={alt} />
        )}

        <span className={styles.ImageViewerOverlay}>
          <Expand />
        </span>
      </button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {useNextImage ? (
          <Image src={src} alt={alt} layout="fill" objectFit="contain" />
        ) : (
          <img src={src} alt={alt} />
        )}
      </Modal>
    </div>
  );
}
