import styles from "./SocialMediaLinks.module.css";
import { IconLink } from "@/types/links";

export default function SocialMediaLinks({
  socialMediaLinks,
  showText,
  vertical,
}: {
  socialMediaLinks: IconLink[];
  showText?: boolean;
  vertical?: boolean;
}) {
  return (
    <nav>
      <menu
        className={[
          styles.SocialMediaLinks,
          vertical && styles.SocialMediaLinksVertical,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {socialMediaLinks.map((socialMediaLink) => (
          <li key={socialMediaLink.href}>
            <a
              className={styles.ButtonLink}
              href={socialMediaLink.href}
              target="_blank"
              rel="noreferrer"
              title={socialMediaLink.linkText}
              aria-label={socialMediaLink.linkText}
            >
              {socialMediaLink.icon}
              <span
                className={`${
                  showText || !socialMediaLink.icon
                    ? styles.SocialMediaLinksTextVisible
                    : styles.SocialMediaLinksTextHidden
                }`}
              >
                {socialMediaLink.linkText}
              </span>
            </a>
          </li>
        ))}
      </menu>
    </nav>
  );
}
