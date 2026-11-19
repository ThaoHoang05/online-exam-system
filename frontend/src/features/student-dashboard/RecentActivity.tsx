import styles from "./dashboard.module.css";

const activities = [
  { title: "Cơ sở dữ liệu", description: "Hoàn thành bài thi", date: "Hôm qua, 15:30", correct: 17, total: 20, icon: "check" },
  { title: "Lập trình hướng đối tượng", description: "Luyện tập", date: "16/11, 20:15", correct: 16, total: 20, icon: "edit" },
] as const;

export function RecentActivity() {
  return (
    <section className={styles.activity} aria-labelledby="activity-title">
      <h2 id="activity-title">Hoạt động gần đây</h2>
      <ol>
        {activities.map(({ title, description, date, correct, total, icon }) => (
          <li key={title} className={styles.activityRow} data-kind={icon}>
            <p className={styles.score}><strong>{correct}/{total}</strong></p>
            <div className={styles.activityIdentity}>
              <p>{description}</p>
              <h3>{title}</h3>
              <p>{date}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
