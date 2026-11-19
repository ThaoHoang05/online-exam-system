import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "./dashboard.module.css";

type FeaturedRoomProps = { roomCode: string; questionCount: number; durationMinutes: number };

export function FeaturedRoomCard({ roomCode, questionCount, durationMinutes }: FeaturedRoomProps) {
  return (
    <section className={styles.featured} aria-labelledby="featured-room-title">
      <div className={styles.featuredContent}>
        <div className={styles.roomTags}>
          <span className={styles.roomStatus}><Icon name="door" /> Phòng thi đang mở</span>
          <span className={styles.roomCode}>{roomCode}</span>
        </div>
        <h1 id="featured-room-title">
          <span className={styles.examType}>Kiểm tra giữa kỳ</span>
          Lập trình mạng
        </h1>
        <Link href={`/student/rooms/${roomCode}`} className={styles.primary}>
          Vào phòng chờ <Icon name="arrow" />
        </Link>
      </div>
      <div className={styles.featuredArtwork}>
        <Image className={styles.mascot} src="/illustrations/exam-robot.svg" width={236} height={195} alt="" />
      </div>
      <div className={styles.roomFooter}>
        <div className={styles.roomDetails}>
          <span><Icon name="check" /> {questionCount} câu</span>
          <span><Icon name="clock" /> {durationMinutes} phút</span>
        </div>
      </div>
    </section>
  );
}
