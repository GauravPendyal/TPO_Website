import { Shield, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { signIn } from "@/auth";

export default function Home() {
  return (
    <main className={styles.hero}>
      <div className={`${styles.content} glass-panel`}>
        <div className={styles.logo}>
          <Shield size={40} />
        </div>
        <h1 className={styles.title}>Skill Tank</h1>
        <p className={styles.subtitle}>Partner & Placement Management</p>

        <form 
          className={styles.form}
          action={async (formData) => {
            "use server"
            await signIn("credentials", formData)
          }}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Work Email</label>
            <input 
              className={styles.input}
              type="email" 
              id="email" 
              name="email" 
              placeholder="tpo@university.edu" 
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input 
              className={styles.input}
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button className={styles.button} type="submit">
            Access Dashboard
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
