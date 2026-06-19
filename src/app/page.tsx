import { Shield, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";


export default async function Home(props: { searchParams?: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const hasError = searchParams?.error === "invalid";

  return (
    <main className={styles.hero}>
      <div className={`${styles.content} glass-panel`}>
        <div className={styles.logo}>
          <Shield size={40} />
        </div>
        <h1 className={styles.title}>Skill Tank</h1>
        <p className={styles.subtitle}>Partner & Placement Management</p>
        
        {hasError && (
          <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem" }}>
            Invalid email or password. Please try again.
          </p>
        )}

        <form 
          className={styles.form}
          action={async (formData) => {
            "use server"
            try {
              await signIn("credentials", {
                ...Object.fromEntries(formData),
                redirectTo: "/" // The middleware will correctly route them after login
              })
            } catch (error: unknown) {
              // NextAuth v5 throws an error object with type 'CredentialsSignin'
              const authError = error as { type?: string; name?: string };
              if (authError?.type === "CredentialsSignin" || authError?.name === "CredentialsSignin") {
                redirect("/?error=invalid");
              }
              // If it's a redirect error (NEXT_REDIRECT) or any other error, rethrow it
              throw error;
            }
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
