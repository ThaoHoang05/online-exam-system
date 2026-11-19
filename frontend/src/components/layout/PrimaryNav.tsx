"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export type NavigationItem = { label: string; href: string };

export function PrimaryNav({ items }: { items: readonly NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Điều hướng chính">
      {items.map(({ href, label }) => {
        const exact = pathname === href;
        const active = exact || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            data-active={active}
            aria-current={exact ? "page" : active ? "location" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
