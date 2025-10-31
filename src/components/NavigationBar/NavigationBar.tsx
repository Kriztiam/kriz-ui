"use client";

import styles from "./NavigationBar.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import Drawer from "@/components/Drawer/Drawer";
import Menu, { SubMenu } from "@/components/Menu/Menu";
import Bars from "@/assets/img/icons/Menu.svg";
import Plus from "@/assets/img/icons/Plus.svg";
import Rhombus from "@/assets/img/icons/Rhombus.svg";
import { useNavigation } from "@/context/NavigationContext";
import { NavLink, NestedLinks } from "@/types/links";

export default function NavigationBar({
  logoSrc,
  logoText,
  linksList,
  className,
  childrenLeft,
  children,
}: {
  logoSrc?: string;
  logoText?: string | React.ReactNode;
  linksList?: (NavLink | NestedLinks)[];
  className?: string;
  childrenLeft?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { Link, pathname } = useNavigation();
  const linksListRef = useRef<HTMLMenuElement>(null);
  const moreMenuRef = useRef<HTMLLIElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [linksListHidden, setLinksListHidden] =
    useState<(NavLink | NestedLinks)[]>();

  useEffect(() => {
    if (!linksListRef.current) return;
    const observer = new ResizeObserver(() => {
      const list = linksListRef.current;
      if (!list) return;
      const firstChildPosition = list.children[0].getBoundingClientRect().top;
      let lastVisibleIndex = list.children.length - 1;

      for (let i = 1; i < list.children.length; i++) {
        const child = list.children[i];
        child.classList.remove(styles.NavigationBarLinkOverflow);
        if (child.getBoundingClientRect().top !== firstChildPosition) {
          lastVisibleIndex = i - 1;
          break;
        }
      }

      const allVisible = lastVisibleIndex + 1 === list.children.length;

      setLinksListHidden(
        allVisible ? undefined : linksList?.slice(lastVisibleIndex)
      );

      if (!allVisible) {
        for (let i = lastVisibleIndex; i < list.children.length; i++) {
          const child = list.children[i];
          if (child !== moreMenuRef.current) {
            child.classList.add(styles.NavigationBarLinkOverflow);
          }
        }
      }
    });

    observer.observe(linksListRef.current);
    return () => {
      observer.disconnect();
    };
  }, [linksList]);

  const renderLink = (link: NavLink, className?: string) => (
    <li key={link.linkText} className={className}>
      <Link
        href={link.href}
        className={
          pathname === link.href ? styles.NavigationBarLinkActive : undefined
        }
      >
        {pathname === link.href && <Rhombus />}
        {link.linkText}
      </Link>
    </li>
  );

  return (
    <nav
      className={[styles.NavigationBar, className].filter(Boolean).join(" ")}
    >
      <Link className={styles.NavigationBarLogo} href={"/"}>
        {logoSrc && <Image src={logoSrc} alt={"NavigationBar logo"} />}
        <span>{logoText}</span>
      </Link>

      <div className={styles.NavigationBarLeftSide}>
        {linksList && (
          <div className={styles.NavigationBarMenu}>
            <Button onClick={() => setIsMenuOpen((prev) => !prev)}>
              <Bars />
            </Button>
            <Drawer fixed isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
              <nav>
                <menu>
                  {linksList.map((link) =>
                    "nestedLinks" in link ? (
                      <SubMenu key={link.linkText} label={link.linkText}>
                        {link.nestedLinks.map((link) => renderLink(link))}
                      </SubMenu>
                    ) : (
                      renderLink(link)
                    )
                  )}
                </menu>
              </nav>
            </Drawer>
          </div>
        )}

        {childrenLeft && (
          <div className={styles.NavigationBarChildrenLeft}>{childrenLeft}</div>
        )}

        {linksList && (
          <menu ref={linksListRef} className={styles.NavigationBarLinksList}>
            {linksList.map((link) =>
              "nestedLinks" in link ? (
                <li key={link.linkText}>
                  <Menu label={link.linkText} asText>
                    {link.nestedLinks.map((link) => renderLink(link))}
                  </Menu>
                </li>
              ) : (
                renderLink(link, styles.NavigationBarLink)
              )
            )}

            {linksListHidden && (
              <li ref={moreMenuRef}>
                <Menu label={<Plus />} asText>
                  {linksListHidden.map((link) =>
                    "nestedLinks" in link ? (
                      <SubMenu key={link.linkText} label={link.linkText}>
                        {link.nestedLinks.map((link) => renderLink(link))}
                      </SubMenu>
                    ) : (
                      renderLink(link)
                    )
                  )}
                </Menu>
              </li>
            )}
          </menu>
        )}
      </div>

      <div className={styles.NavigationBarChildren}>{children}</div>
    </nav>
  );
}
