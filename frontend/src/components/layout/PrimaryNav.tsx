"use client";

import { HeaderArt, type HeaderArtName } from "./HeaderArt";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export type NavigationItem = { label: string; href: string; icon?: HeaderArtName };

export function PrimaryNav({ items }: { items: readonly NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Điều hướng chính">
      {items.map(({ href, label, icon }) => {
        const exact = pathname === href;
        const active = exact || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            data-active={active}
            data-icon={icon}
            aria-current={exact ? "page" : active ? "location" : undefined}
          >
            {icon && <HeaderArt name={icon} />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
