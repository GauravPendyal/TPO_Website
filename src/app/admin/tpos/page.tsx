import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";

export default async function TPOsPage() {
  const tpos = await prisma.user.findMany({
    where: { role: "TPO_ADMIN" },
    include: {
      college: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Manage TPO Admins</h1>
        <p>View and manage all Training and Placement Officers.</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>TPO Directory</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tpos.map((tpo) => (
              <tr key={tpo.id}>
                <td>{tpo.name}</td>
                <td>{tpo.email}</td>
                <td>{tpo.college?.name || "Unassigned"}</td>
                <td>{new Date(tpo.createdAt).toLocaleDateString()}</td>
                <td>
                  <button style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "6px",
                    background: "hsl(var(--bg-tertiary))",
                    border: "1px solid hsl(var(--border-subtle))",
                    cursor: "pointer",
                    fontSize: "0.75rem"
                  }}>
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {tpos.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No TPO Admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
