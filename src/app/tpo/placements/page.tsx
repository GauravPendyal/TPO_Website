import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { Download, Plus } from "lucide-react";
import Link from "next/link";

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
      <div className={styles.welcome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <h1>Placement Tracking</h1>
          <p>Monitor your students&apos; job offers and success rates.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link href="/api/reports/placements?format=csv" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "hsl(var(--bg-tertiary))",
            color: "hsl(var(--text-primary))",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid hsl(var(--border-subtle))"
          }}>
            <Download size={18} />
            CSV
          </Link>
          <Link href="/api/reports/placements?format=pdf" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "hsl(var(--bg-tertiary))",
            color: "hsl(var(--text-primary))",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontWeight: 600,
            textDecoration: "none",
            border: "1px solid hsl(var(--border-subtle))"
          }}>
            <Download size={18} />
            PDF
          </Link>
          <Link href="/tpo/placements/add" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "hsl(var(--brand-primary))",
            color: "white",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.2s ease"
          }}>
            <Plus size={18} />
            Add Placement
          </Link>
        </div>
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
