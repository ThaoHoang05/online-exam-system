import { HeaderArt } from "@/components/layout/HeaderArt";
import styles from "./page-loading.module.css";

export function PageLoading({ label = "Đang tải trang…" }: { label?: string }) {
  return (
    <div className={styles.stage} role="status">
      <span className={styles.logo} aria-hidden="true"><HeaderArt name="logo" /></span>
      <span>{label}</span>
      <span className={styles.track} aria-hidden="true" />
    </div>
  );
}
