import type { Metadata } from "next";
import { FeaturedRoomCard } from "@/features/student-dashboard/FeaturedRoomCard";
import { DashboardShortcuts } from "@/features/student-dashboard/DashboardShortcuts";
import { RecentActivity } from "@/features/student-dashboard/RecentActivity";
import styles from "@/features/student-dashboard/dashboard.module.css";

export const metadata: Metadata = { title: "Tổng quan" };

export default function StudentDashboardPage() {
  return (
    <main className={styles.dashboard}>
      <FeaturedRoomCard roomCode="LTM-204" questionCount={30} durationMinutes={45} />
      <DashboardShortcuts />
      <RecentActivity />
    </main>
  );
}
