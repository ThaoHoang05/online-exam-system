import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import styles from "./student-layout.module.css";

const studentNavigation = [
  { label: "Phòng thi", href: "/student/rooms", icon: "door" },
  { label: "Luyện tập", href: "/student/practice", icon: "book" },
  { label: "Thống kê", href: "/student/statistics", icon: "chart" },
] as const;

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader homeHref="/student/dashboard" items={studentNavigation} name="Hạnh Nhi" role="Sinh viên" />
      {children}
    </div>
  );
}
