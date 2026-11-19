import Link from "next/link";
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
        <Link href={homeHref} className={styles.brand}>
          <span className={styles.logo}><Icon name="ticket" /></span>
          Trạm Thi
        </Link>
        <PrimaryNav items={items} />
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
