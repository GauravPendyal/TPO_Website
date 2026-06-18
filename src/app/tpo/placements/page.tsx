import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function PlacementsPage() {
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

  const placements = await prisma.placement.findMany({
    where: { student: { collegeId } },
    include: { student: true },
    orderBy: { dateOffered: "desc" },
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Placement Tracking</h1>
        <p>Monitor your students' job offers and success rates.</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>All Placements</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Company</th>
              <th>Role</th>
              <th>Salary (LPA)</th>
              <th>Date Offered</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((placement) => (
              <tr key={placement.id}>
                <td>{placement.student.name}</td>
                <td>{placement.companyName}</td>
                <td>{placement.role}</td>
                <td>{placement.salary ? `${placement.salary} LPA` : "Undisclosed"}</td>
                <td>{new Date(placement.dateOffered).toLocaleDateString()}</td>
              </tr>
            ))}
            {placements.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No placements recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
