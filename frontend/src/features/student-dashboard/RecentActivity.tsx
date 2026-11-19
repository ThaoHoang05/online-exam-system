import { Icon } from "@/components/ui/Icon";
import styles from "./dashboard.module.css";

const activities = [
  { title: "Cơ sở dữ liệu", description: "Hoàn thành bài thi", date: "Hôm qua, 15:30", score: "8,5/10", unit: "điểm", icon: "check" },
  { title: "Lập trình hướng đối tượng", description: "Luyện tập · 20 câu", date: "16/11, 20:15", score: "16/20", unit: "câu đúng", icon: "edit" },
] as const;

export function RecentActivity() {
  return (
    <section className={styles.activity} aria-labelledby="activity-title">
      <h2 id="activity-title">Hoạt động gần đây</h2>
      <ul>
        {activities.map(({ title, description, date, score, unit, icon }) => (
          <li key={title} className={styles.activityRow}>
            <div className={styles.activityIdentity}>
              <span className={styles.iconTile} data-kind={icon}><Icon name={icon} /></span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </div>
            <div className={styles.activityMeta}>
              <p className={styles.activityDate}><Icon name="clock" /> {date}</p>
              <p className={styles.score}><strong>{score}</strong> <span>{unit}</span></p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
