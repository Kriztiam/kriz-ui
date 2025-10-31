"use client";

import styles from "./Tabs.module.css";
import { useState } from "react";
import Button from "@/components/Button/Button";

export default function Tabs({
  tabsNames,
  tabsContent,
  fillEmptySpace,
  simpleStyle,
}: {
  tabsNames: string[];
  tabsContent: React.ReactNode[];
  fillEmptySpace?: boolean;
  simpleStyle?: boolean;
}) {
  const [tabSelected, setTabSelected] = useState(0);

  return (
    <div
      className={[
        styles.TabContainer,
        !simpleStyle && styles.TabContainerBackground,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          styles.TabButtonsContainer,
          !simpleStyle && styles.TabButtonsContainerBackground,
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            "--fillEmptySpace": fillEmptySpace && "auto-fit",
          } as React.CSSProperties
        }
      >
        {tabsNames.map((element, i: number) => (
          <Button
            key={"TabButton" + i}
            onClick={() => setTabSelected(i)}
            outline={tabSelected !== i}
          >
            {element}
          </Button>
        ))}
      </div>

      {tabsContent.map((element, i: number) => (
        <div
          key={"TabContent" + i}
          className={[
            styles.TabContent,
            tabSelected !== i && styles.TabContentHidden,
            !simpleStyle && styles.TabContentBackground,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {element}
        </div>
      ))}
    </div>
  );
}
