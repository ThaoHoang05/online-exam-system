import type { Metadata } from "next";
import { FeaturedRoomCard } from "@/features/student-dashboard/FeaturedRoomCard";
import { DashboardShortcuts } from "@/features/student-dashboard/DashboardShortcuts";
import { RecentActivity } from "@/features/student-dashboard/RecentActivity";
import styles from "@/features/student-dashboard/dashboard.module.css";

export const metadata: Metadata = { title: "Tổng quan" };

export default function StudentDashboardPage() {
  return (
    <main className={styles.dashboard}>
      <div className={styles.greeting}>
        <h1>Chào, Hạnh Nhi</h1>
        <p>Mọi thứ đã sẵn sàng. Bắt đầu hành trình hôm nay nhé.</p>
      </div>
      <FeaturedRoomCard roomCode="LTM-204" questionCount={30} durationMinutes={45} />
      <DashboardShortcuts />
      <RecentActivity />
    </main>
  );
}
