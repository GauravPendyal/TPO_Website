import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function FinancePage() {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  if (!collegeId) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.welcome}>
          <h1>Access Denied</h1>
        </div>
      </div>
    );
  }

  const college = await prisma.college.findUnique({
    where: { id: collegeId },
  });

  const placements = await prisma.placement.findMany({
    where: { student: { collegeId } },
    include: { student: true },
    orderBy: { dateOffered: "desc" }
  });

  // Calculate revenue (assuming salary is in LPA and we take the revenue share % from the first year)
  // Converting LPA to actual amount for display: 1 LPA = 1,00,000 INR
  const totalSalaryLPA = placements.reduce((sum, p) => sum + (p.salary || 0), 0);
  const revenueShare = college?.revenueSharePercentage || 0;
  const totalRevenueGenerated = totalSalaryLPA * 100000 * (revenueShare / 100);

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Financial Overview</h1>
        <p>Track revenue share and payment statuses.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>Rs. {totalRevenueGenerated.toLocaleString('en-IN')}</span>
            <span className={styles.statLabel}>Total Revenue Generated</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>Rs. {totalRevenueGenerated.toLocaleString('en-IN')}</span>
            <span className={styles.statLabel}>Pending Payouts (Est.)</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Placements (Revenue Source)</h3>
        </div>
        
        {placements.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Company</th>
                <th>Salary (LPA)</th>
                <th>Revenue Share ({revenueShare}%)</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => {
                const placementRevenue = (p.salary || 0) * 100000 * (revenueShare / 100);
                return (
                  <tr key={p.id}>
                    <td>{p.student.name}</td>
                    <td>{p.companyName}</td>
                    <td>{p.salary || 0}</td>
                    <td>Rs. {placementRevenue.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "hsl(var(--text-secondary))" }}>
            <p>No financial transactions available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
