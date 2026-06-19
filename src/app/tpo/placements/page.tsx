import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

import { Plus } from "lucide-react";
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
      <div className={styles.welcome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Placement Tracking</h1>
          <p>Monitor your students' job offers and success rates.</p>
        </div>
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
