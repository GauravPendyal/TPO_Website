import styles from "../page.module.css";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function StudentsPage() {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  if (!collegeId) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.welcome}>
          <h1>Access Denied</h1>
          <p>You are not assigned to a college.</p>
        </div>
      </div>
    );
  }

  const students = await prisma.student.findMany({
    where: { collegeId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Student Roster</h1>
          <p>Manage all students registered under your college.</p>
        </div>
        <Link href="/tpo/students/add" style={{
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
          Add Student
        </Link>
      </div>

      <div className={styles.section}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Grad Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.department}</td>
                <td>{student.gradYear}</td>
                <td>
                  <button style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "6px",
                    background: "hsl(var(--bg-tertiary))",
                    border: "1px solid hsl(var(--border-subtle))",
                    cursor: "pointer",
                    fontSize: "0.75rem"
                  }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  No students found. Click "Add Student" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
