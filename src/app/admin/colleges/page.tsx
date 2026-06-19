import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";

import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CollegesPage() {
  const colleges = await prisma.college.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Manage Colleges</h1>
          <p>View and manage all your institutional partners.</p>
        </div>
        <Link href="/admin/colleges/add" style={{
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
          Add College
        </Link>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>All Colleges</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>College Name</th>
              <th>University</th>
              <th>Partnership Type</th>
              <th>Revenue Share</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => (
              <tr key={college.id}>
                <td>{college.name}</td>
                <td>{college.university}</td>
                <td>{college.partnershipType}</td>
                <td>{college.revenueSharePercentage}%</td>
                <td>
                  <span className={styles.statusBadge} data-status={college.status.toLowerCase()}>
                    {college.status}
                  </span>
                </td>
                <td>
                  <button style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "6px",
                    background: "hsl(var(--bg-tertiary))",
                    border: "1px solid hsl(var(--border-subtle))",
                    cursor: "pointer",
                    fontSize: "0.75rem"
                  }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
