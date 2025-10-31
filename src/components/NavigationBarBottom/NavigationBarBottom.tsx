"use client";

import styles from "./NavigationBarBottom.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Drawer from "@/components/Drawer/Drawer";
import { SubMenu } from "@/components/Menu/Menu";
import House from "@/assets/img/icons/House.svg";
import Bars from "@/assets/img/icons/Menu.svg";
import Rhombus from "@/assets/img/icons/Rhombus.svg";
import SquareArrowUp from "@/assets/img/icons/SquareArrowUp.svg";
import { useNavigation } from "@/context/NavigationContext";
import { IconLink, NavLink, NestedLinks } from "@/types/links";

export default function NavigationBarBottom({
  logoSrc,
  linksInBar,
  showIconLabel,
  linksList,
  className,
  children,
}: {
  logoSrc?: string;
  linksInBar?: IconLink[];
  showIconLabel?: boolean;
  linksList?: (NavLink | NestedLinks)[];
  className?: string;
  children?: React.ReactNode;
}) {
  const { Link, pathname } = useNavigation();
  const menu = useRef<HTMLMenuElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!menu.current) return;
    if (!linksList) return;
    const observer = new ResizeObserver(() => {
      if (!menu.current) return;
      const firstChildPosition =
        menu.current.children[0].getBoundingClientRect().top;

      let lastVisibleChildIndex = menu.current.children.length - 1;

      for (let i = 1; i < menu.current.children.length; i++) {
        const currentChild = menu.current.children[i];

        currentChild.classList.remove(styles.NavigationBarLinkOverflow);

        if (currentChild.getBoundingClientRect().top !== firstChildPosition) {
          lastVisibleChildIndex = i - 1;
          break;
        }
      }

      const areAllElementVisible =
        lastVisibleChildIndex + 1 === menu.current.children.length;

      if (!areAllElementVisible && lastVisibleChildIndex > 0) {
        for (
          let i = menu.current.children.length - 1 - 1;
          i >= lastVisibleChildIndex;
          i--
        ) {
          const currentChild = menu.current.children[i];
          currentChild.classList.add(styles.NavigationBarLinkOverflow);
        }
      }
    });

    observer.observe(menu.current);
    return () => {
      observer.disconnect();
    };
  }, [linksList]);

  return (
    <nav
      className={[styles.NavigationBarBottom, className]
        .filter(Boolean)
        .join(" ")}
    >
      <menu ref={menu} className={styles.NavigationBarBottomLinksList}>
        <li
          className={[
            styles.NavigationBarBottomLink,
            !showIconLabel && styles.NavigationBarBottomLinkTextHidden,
            pathname === "/" && styles.NavigationBarBottomLinkActive,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Link className={styles.NavigationBarBottomLogo} href={"/"}>
            {logoSrc ? (
              <Image src={logoSrc} alt={"NavigationBarBottom logo"} />
            ) : (
              <>
                <House />
                <span>Home</span>
              </>
            )}
          </Link>
        </li>

        {linksInBar?.map((link, index) => (
          <li
            key={"NavigationBarBottomLink" + index}
            className={[
              styles.NavigationBarBottomLink,
              !showIconLabel && styles.NavigationBarBottomLinkTextHidden,
              pathname === link.href && styles.NavigationBarBottomLinkActive,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link href={link.href}>
              {link.icon ? link.icon : <SquareArrowUp />}
              <span>{link.linkText}</span>
            </Link>
          </li>
        ))}

        {(linksList || children) && (
          <li
            className={[
              styles.NavigationBarBottomLink,
              !showIconLabel && styles.NavigationBarBottomLinkTextHidden,
              isMenuOpen && styles.NavigationBarBottomLinkActive,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              className={styles.NavigationBarBottomMenuButton}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Bars />
              <span>Menu</span>
            </button>
          </li>
        )}
      </menu>

      {(linksList || children) && (
        <Drawer fixed fromRight isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          {linksList && (
            <nav>
              <menu>
                {linksList.map((link, index) =>
                  "nestedLinks" in link ? (
                    <SubMenu key={link.linkText} label={link.linkText}>
                      {link.nestedLinks.map((nestedLink, index) => (
                        <li key={"NavigationBarBottomDrawerNestedLink" + index}>
                          <Link
                            href={nestedLink.href}
                            className={
                              pathname === nestedLink.href
                                ? styles.NavigationBarBottomDrawerLinkActive
                                : undefined
                            }
                          >
                            {pathname === nestedLink.href && <Rhombus />}
                            {nestedLink.linkText}
                          </Link>
                        </li>
                      ))}
                    </SubMenu>
                  ) : (
                    <li key={"NavigationBarBottomDrawerLink" + index}>
                      <Link
                        href={link.href}
                        className={
                          pathname === link.href
                            ? styles.NavigationBarBottomDrawerLinkActive
                            : undefined
                        }
                      >
                        {pathname === link.href && <Rhombus />}
                        {link.linkText}
                      </Link>
                    </li>
                  )
                )}
              </menu>
            </nav>
          )}

          <div>{children}</div>
        </Drawer>
      )}
    </nav>
  );
}
