import { Briefcase, Download, FileText, GraduationCap, IndianRupee } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function TPODashboard() {
  const session = await auth();
  const collegeId = session?.user?.collegeId;
  const whereClause = collegeId ? { collegeId } : {};
  const renewalCutoff = new Date();
  renewalCutoff.setDate(renewalCutoff.getDate() + 30);

  const [studentsCount, placementsCount, students, college, placements, expiringMous] = await Promise.all([
    prisma.student.count({ where: whereClause }),
    prisma.placement.count({ where: { student: whereClause } }),
    prisma.student.findMany({
      where: whereClause,
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    collegeId ? prisma.college.findUnique({ where: { id: collegeId } }) : null,
    prisma.placement.findMany({ where: { student: whereClause } }),
    collegeId
      ? prisma.mou.findMany({
          where: {
            collegeId,
            endDate: {
              lte: renewalCutoff,
            },
          },
          orderBy: { endDate: "asc" },
        })
      : [],
  ]);

  const totalSalaryLPA = placements.reduce((sum, p) => sum + (p.salary || 0), 0);
  const revenueShare = college?.revenueSharePercentage || 0;
  const totalRevenue = totalSalaryLPA * 100000 * (revenueShare / 100);

  const stats = [
    { label: "Total Students", value: studentsCount, icon: GraduationCap },
    { label: "Successful Placements", value: placementsCount, icon: Briefcase },
    { label: "Active Offers", value: placementsCount.toString(), icon: FileText },
    { label: "Total Revenue Generated", value: `Rs. ${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>TPO Overview</h1>
        <p>Manage your students, track placements, and monitor generated revenue.</p>
      </div>

      {expiringMous.length > 0 && (
        <div className={styles.section} style={{ borderLeft: "4px solid hsl(var(--warning))" }}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>MOU Renewal Alert</h3>
          </div>
          <p style={{ color: "hsl(var(--text-secondary))" }}>
            {expiringMous.length} agreement(s) expire within 30 days. Earliest renewal date:{" "}
            {expiringMous[0].endDate.toLocaleDateString()}.
          </p>
        </div>
      )}

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

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Reports</h3>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/api/reports/placements?format=csv" style={reportLinkStyle}>
            <Download size={18} />
            Placement CSV
          </Link>
          <Link href="/api/reports/placements?format=pdf" style={reportLinkStyle}>
            <Download size={18} />
            Placement PDF
          </Link>
          <Link href="/api/reports/cohort" style={reportLinkStyle}>
            <Download size={18} />
            Cohort CSV
          </Link>
        </div>
      </div>
    </div>
  );
}

const reportLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  background: "hsl(var(--bg-tertiary))",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid hsl(var(--border-subtle))",
  fontWeight: 600,
} as const;
