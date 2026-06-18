import { GraduationCap, Briefcase, IndianRupee, FileText } from "lucide-react";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function TPODashboard() {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  // We only fetch stats for THIS college if collegeId exists
  const whereClause = collegeId ? { collegeId } : {};

  const [studentsCount, placementsCount, students] = await Promise.all([
    prisma.student.count({ where: whereClause }),
    prisma.placement.count({ where: { student: whereClause } }),
    prisma.student.findMany({
      where: whereClause,
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "Total Students", value: studentsCount, icon: GraduationCap },
    { label: "Successful Placements", value: placementsCount, icon: Briefcase },
    { label: "Active Offers", value: "0", icon: FileText },
    { label: "Total Revenue Generated", value: "₹0", icon: IndianRupee },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>TPO Overview</h1>
        <p>Manage your students, track placements, and monitor generated revenue.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>
              <stat.icon size={28} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recently Added Students</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>
                  <span className={styles.statusBadge} data-status="pending">
                    Available
                  </span>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No students added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
