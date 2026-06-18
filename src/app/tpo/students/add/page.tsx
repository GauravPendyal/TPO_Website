import { addStudent } from "../actions";
import styles from "./page.module.css";
import dashboardStyles from "../../page.module.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddStudentPage() {
  return (
    <div className={dashboardStyles.dashboard}>
      <div className={dashboardStyles.welcome} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/tpo/students" style={{ color: "hsl(var(--text-secondary))", textDecoration: "none" }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1>Add New Student</h1>
          <p>Register a new student to your college roster.</p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form action={addStudent} className={styles.formGrid}>
          <h3 className={styles.sectionTitle}>Student Details</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name *</label>
            <input type="text" id="name" name="name" required className={styles.input} placeholder="John Doe" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address *</label>
            <input type="email" id="email" name="email" required className={styles.input} placeholder="john@example.com" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department" className={styles.label}>Department *</label>
            <input type="text" id="department" name="department" required className={styles.input} placeholder="e.g. Computer Science" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gradYear" className={styles.label}>Graduation Year *</label>
            <input type="number" id="gradYear" name="gradYear" required className={styles.input} min="2020" max="2030" placeholder="2025" />
          </div>

          <div className={styles.fullWidth}>
            <button type="submit" className={styles.submitBtn}>
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
