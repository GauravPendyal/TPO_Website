import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (!isLoggedIn && pathname !== "/") {
    return Response.redirect(new URL("/", req.nextUrl))
  }

  if (isLoggedIn && pathname === "/") {
    // Redirect based on role
    const role = req.auth?.user?.role
    if (role === "super_admin") {
      return Response.redirect(new URL("/admin", req.nextUrl))
    } else if (role === "tpo_admin" || role === "tpo_staff") {
      return Response.redirect(new URL("/tpo", req.nextUrl))
    }
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
