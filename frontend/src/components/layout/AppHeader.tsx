import Link from "next/link";
import { Suspense } from "react";
import { HeaderArt } from "./HeaderArt";
import { Icon } from "@/components/ui/Icon";
import { PrimaryNav, type NavigationItem } from "./PrimaryNav";
import styles from "./header.module.css";

type AppHeaderProps = {
  homeHref: string;
  items: readonly NavigationItem[];
  name: string;
  role: string;
};

export function AppHeader({ homeHref, items, name, role }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={homeHref} className={styles.brand} aria-label="Online Exam — về tổng quan">
          <HeaderArt name="logo" />
          Online Exam
        </Link>
        <Suspense fallback={<nav aria-label="Điều hướng học sinh" />}>
          <PrimaryNav items={items} />
        </Suspense>
        <div className={styles.account}>
          <span aria-hidden="true" className={styles.avatar}><Icon name="user" /></span>
          <div>
            <strong>{name}</strong>
            <small>{role}</small>
          </div>
        </div>
      </div>
    </header>
  );
}
