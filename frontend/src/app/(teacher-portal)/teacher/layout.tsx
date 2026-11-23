import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import styles from "../teacher.module.css";

const navigation = [
  { label: "Tổng quan", href: "/teacher/dashboard", icon: "chart" },
  { label: "Phòng thi", href: "/teacher/rooms", icon: "door" },
  { label: "Câu hỏi", href: "/teacher/questions", icon: "book" },
  { label: "Danh mục", href: "/teacher/categories", icon: "book" },
] as const;

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <div className={styles.shell}><AppHeader homeHref="/teacher/dashboard" items={navigation} name="Minh Anh" role="Giảng viên" />{children}</div>;
}
