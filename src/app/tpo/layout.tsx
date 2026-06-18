import { Shield, LayoutDashboard, GraduationCap, Briefcase, DollarSign, LogOut } from "lucide-react";
import styles from "./layout.module.css";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TPOLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session || session.user.role !== "TPO_ADMIN") {
    redirect("/");
  }

  // Fetch college info for the sidebar
  const userWithCollege = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { college: true }
  });

  const collegeName = userWithCollege?.college?.name || "TPO Portal";

  const navItems = [
    { label: "Overview", href: "/tpo", icon: LayoutDashboard },
    { label: "Student Roster", href: "/tpo/students", icon: GraduationCap },
    { label: "Placements", href: "/tpo/placements", icon: Briefcase },
    { label: "Finance", href: "/tpo/finance", icon: DollarSign },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Shield className={styles.brandIcon} size={28} />
          <span style={{ fontSize: "1rem", lineHeight: "1.2" }}>{collegeName}</span>
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
            {session.user.name?.charAt(0).toUpperCase() || "T"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{session.user.name}</span>
            <span className={styles.userRole}>TPO Admin</span>
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h2 className={styles.pageTitle}>Placement Cell Dashboard</h2>
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
