import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "./dashboard.module.css";

type FeaturedRoomProps = { roomCode: string; questionCount: number; durationMinutes: number };

export function FeaturedRoomCard({ roomCode, questionCount, durationMinutes }: FeaturedRoomProps) {
  return (
    <section className={styles.featured} aria-labelledby="featured-room-title">
      <div className={styles.featuredContent}>
        <span className={styles.roomStatus}><Icon name="door" /> Phòng thi đang mở</span>
        <div>
          <h2 id="featured-room-title">Kiểm tra giữa kỳ —<br />Lập trình mạng</h2>
          <div className={styles.roomDetails}>
            <span className={styles.roomCode}>{roomCode}</span>
            <span><Icon name="clock" /> {questionCount} câu · {durationMinutes} phút</span>
          </div>
        </div>
        <div className={styles.roomAction}>
          <Link href={`/student/rooms/${roomCode}`} className={styles.primary}>
            Vào phòng chờ <Icon name="arrow" />
          </Link>
          <p>Kiểm tra thiết bị trước khi bắt đầu.</p>
        </div>
      </div>
      <Image className={styles.mascot} src="/illustrations/exam-robot.svg" width={320} height={290} alt="" />
    </section>
  );
}
