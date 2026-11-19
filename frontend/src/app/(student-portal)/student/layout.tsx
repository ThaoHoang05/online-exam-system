import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import styles from "./student-layout.module.css";

const studentNavigation = [
  { label: "Tổng quan", href: "/student/dashboard" },
  { label: "Phòng thi", href: "/student/rooms" },
  { label: "Luyện tập", href: "/student/practice" },
  { label: "Thống kê", href: "/student/statistics" },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader homeHref="/student/dashboard" items={studentNavigation} name="Hạnh Nhi" role="Sinh viên" />
      {children}
    </div>
  );
}
