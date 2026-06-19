import { addPlacement } from "../actions";
import styles from "../../students/add/page.module.css";
import dashboardStyles from "../../page.module.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function AddPlacementPage() {
  const session = await auth();
  const collegeId = session?.user?.collegeId;

  const students = collegeId ? await prisma.student.findMany({
    where: { collegeId },
    orderBy: { name: "asc" }
  }) : [];

  return (
    <div className={dashboardStyles.dashboard}>
      <div className={dashboardStyles.welcome} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/tpo/placements" style={{ color: "hsl(var(--text-secondary))", textDecoration: "none" }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1>Add New Placement</h1>
          <p>Record a job offer for a student.</p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form action={addPlacement} className={styles.formGrid}>
          <h3 className={styles.sectionTitle}>Placement Details</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="studentId" className={styles.label}>Select Student *</label>
            <select id="studentId" name="studentId" required className={styles.input}>
              <option value="">-- Choose a student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="companyName" className={styles.label}>Company Name *</label>
            <input type="text" id="companyName" name="companyName" required className={styles.input} placeholder="Tech Corp" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>Role / Designation *</label>
            <input type="text" id="role" name="role" required className={styles.input} placeholder="Software Engineer" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="salary" className={styles.label}>Salary (LPA)</label>
            <input type="number" id="salary" name="salary" className={styles.input} step="0.01" min="0" placeholder="12.5" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="dateOffered" className={styles.label}>Date Offered *</label>
            <input type="date" id="dateOffered" name="dateOffered" required className={styles.input} />
          </div>

          <div className={styles.fullWidth}>
            <button type="submit" className={styles.submitBtn}>
              Record Placement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
