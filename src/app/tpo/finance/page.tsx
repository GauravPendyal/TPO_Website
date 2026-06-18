import styles from "../page.module.css";

export default function FinancePage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Financial Overview</h1>
        <p>Track revenue share and payment statuses.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>₹0</span>
            <span className={styles.statLabel}>Total Revenue Generated</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>₹0</span>
            <span className={styles.statLabel}>Pending Payouts</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Transactions</h3>
        </div>
        <div style={{ padding: "2rem", textAlign: "center", color: "hsl(var(--text-secondary))" }}>
          <p>No financial transactions available.</p>
        </div>
      </div>
    </div>
  );
}
