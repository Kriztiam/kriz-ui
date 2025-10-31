"use client";

import styles from "./Breadcrumb.module.css";
import Menu from "@/components/Menu/Menu";
import { useNavigation } from "@/context/NavigationContext";
import { IconLink, NavLink, NestedLinks } from "@/types/links";

export default function Breadcrumb({
  homeLink,
  linksList,
}: {
  homeLink?: NavLink | IconLink;
  linksList: (NavLink | NestedLinks)[];
}) {
  const { Link } = useNavigation();
  return (
    <nav className={styles.Breadcrumb}>
      <ol>
        {homeLink && (
          <li>
            <Link href={homeLink.href}>
              {"icon" in homeLink && homeLink.icon}
              {homeLink.linkText}
            </Link>
          </li>
        )}

        {linksList.map((item) =>
          "nestedLinks" in item ? (
            <li key={item.linkText}>
              <Menu label={item.linkText} asText>
                {item.nestedLinks.map((nestedLink) => (
                  <li key={nestedLink.linkText}>
                    <Link
                      href={nestedLink.href}
                      className={
                        item.linkText === nestedLink.linkText
                          ? styles.CurrentPath
                          : undefined
                      }
                    >
                      {nestedLink.linkText}
                    </Link>
                  </li>
                ))}
              </Menu>
            </li>
          ) : (
            <li key={item.linkText}>
              <Link href={item.href}>{item.linkText}</Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
