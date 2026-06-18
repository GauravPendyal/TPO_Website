import { Shield, Building2, Users, LayoutDashboard, LogOut } from "lucide-react";
import styles from "./layout.module.css";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Colleges", href: "/admin/colleges", icon: Building2 },
    { label: "TPO Admins", href: "/admin/tpos", icon: Users },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Shield className={styles.brandIcon} size={28} />
          <span>Skill Tank</span>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navItem}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {session.user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{session.user.name}</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.pageTitle}>Admin Portal</h2>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button className={styles.logoutBtn} type="submit">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </header>
        <section className={styles.content}>
          {children}
        </section>
      </main>
    </div>
  );
}
