import { Building2, Users, GraduationCap, Briefcase } from "lucide-react";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [collegesCount, tposCount, studentsCount, placementsCount] = await Promise.all([
    prisma.college.count(),
    prisma.user.count({ where: { role: "TPO_ADMIN" } }),
    prisma.student.count(),
    prisma.placement.count(),
  ]);

  const recentColleges = await prisma.college.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Partner Colleges", value: collegesCount, icon: Building2 },
    { label: "TPO Admins", value: tposCount, icon: Users },
    { label: "Total Students", value: studentsCount, icon: GraduationCap },
    { label: "Placements", value: placementsCount, icon: Briefcase },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Dashboard Overview</h1>
        <p>Monitor your partnerships, enrollments, and placement outcomes globally.</p>
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
          <h3 className={styles.sectionTitle}>Recently Added Colleges</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>College Name</th>
              <th>University</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentColleges.map((college) => (
              <tr key={college.id}>
                <td>{college.name}</td>
                <td>{college.university}</td>
                <td>{college.partnershipType}</td>
                <td>
                  <span className={styles.statusBadge} data-status={college.status.toLowerCase()}>
                    {college.status}
                  </span>
                </td>
              </tr>
            ))}
            {recentColleges.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No colleges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
