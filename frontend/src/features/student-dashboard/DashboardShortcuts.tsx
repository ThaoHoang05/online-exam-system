import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "./dashboard.module.css";

const shortcuts = [
  { href: "/student/practice", name: "Luyện tập theo chủ đề", description: "Chọn chủ đề và độ khó.", icon: "book" },
  { href: "/student/statistics", name: "Xem thống kê", description: "Xem điểm và lịch sử làm bài.", icon: "chart" },
] as const;

export function DashboardShortcuts() {
  return (
    <nav className={styles.shortcuts} aria-label="Lối tắt">
      {shortcuts.map(({ href, name, description, icon }) => (
        <Link className={styles.shortcut} href={href} key={href}>
          <span className={styles.iconTile}><Icon name={icon} /></span>
          <div><h2>{name}</h2><p>{description}</p></div>
          <Icon name="chevron" />
        </Link>
      ))}
    </nav>
  );
}
