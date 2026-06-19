import { addCollege } from "../actions";
import styles from "../../tpo/students/add/page.module.css";
import dashboardStyles from "../../page.module.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddCollegePage() {
  return (
    <div className={dashboardStyles.dashboard}>
      <div className={dashboardStyles.welcome} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/admin/colleges" style={{ color: "hsl(var(--text-secondary))", textDecoration: "none" }}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1>Add New College</h1>
          <p>Register a new institutional partner.</p>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form action={addCollege} className={styles.formGrid}>
          <h3 className={styles.sectionTitle}>College Details</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>College Name *</label>
            <input type="text" id="name" name="name" required className={styles.input} placeholder="Tech University" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="university" className={styles.label}>University Affiliation</label>
            <input type="text" id="university" name="university" className={styles.input} placeholder="State University" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="partnershipType" className={styles.label}>Partnership Type *</label>
            <select id="partnershipType" name="partnershipType" className={styles.input}>
              <option value="CRT">CRT</option>
              <option value="FDP">FDP</option>
              <option value="EXTERNAL">External</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="revenueSharePercentage" className={styles.label}>Revenue Share (%) *</label>
            <input type="number" id="revenueSharePercentage" name="revenueSharePercentage" required className={styles.input} min="0" max="100" step="0.1" placeholder="30" />
          </div>

          <div className={styles.fullWidth}>
            <button type="submit" className={styles.submitBtn}>
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
