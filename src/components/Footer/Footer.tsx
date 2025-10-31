"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import SocialMediaLinks from "@/components/SocialMediaLinks/SocialMediaLinks";
import { useNavigation } from "@/context/NavigationContext";
import { IconLink, NestedLinks } from "@/types/links";

export default function Footer({
  logoImgSrc,
  logoText,
  logoBelowContent,
  linksList,
  footerBottomContent,
  socialMediaLinks,
  children,
}: {
  logoImgSrc?: string;
  logoText?: string | React.ReactNode;
  logoBelowContent?: React.ReactNode;
  linksList?: NestedLinks[];
  footerBottomContent?: React.ReactNode;
  socialMediaLinks?: IconLink[];
  children?: React.ReactNode;
}) {
  const { Link } = useNavigation();
  return (
    <footer className={styles.Footer}>
      {children && <div className={styles.FooterTopContent}>{children}</div>}

      {(logoImgSrc || logoText || linksList) && (
        <div className={styles.FooterMainContent}>
          {(logoImgSrc || logoText) && (
            <div className={styles.FooterMainContentLogoContainer}>
              <div className={styles.FooterMainContentLogo}>
                {logoImgSrc && <Image src={logoImgSrc} alt={"Footer logo"} />}
                <span>{logoText}</span>
              </div>

              {logoBelowContent && (
                <div className={styles.FooterMainContentBelowLogo}>
                  {logoBelowContent}
                </div>
              )}
            </div>
          )}

          {linksList && (
            <>
              {linksList?.map((link) =>
                "nestedLinks" in link ? (
                  <nav
                    className={styles.FooterMainContentLinks}
                    key={link.linkText}
                  >
                    <h3>{link.linkText}</h3>
                    <menu>
                      {link.nestedLinks?.map((nestedLink) => (
                        <li key={nestedLink.linkText}>
                          <Link href={nestedLink.href}>
                            {nestedLink.linkText}
                          </Link>
                        </li>
                      ))}
                    </menu>
                  </nav>
                ) : null
              )}
            </>
          )}
        </div>
      )}

      {(footerBottomContent || socialMediaLinks) && (
        <div
          className={styles.FooterBottom}
          style={
            !(logoImgSrc || logoText || linksList) ? { border: "none" } : {}
          }
        >
          <div>{footerBottomContent}</div>
          {socialMediaLinks && (
            <SocialMediaLinks socialMediaLinks={socialMediaLinks} />
          )}
        </div>
      )}
    </footer>
  );
}
