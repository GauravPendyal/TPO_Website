import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (!isLoggedIn && pathname !== "/") {
    return Response.redirect(new URL("/", req.nextUrl))
  }

  if (isLoggedIn) {
    const role = req.auth?.user?.role

    if (pathname === "/") {
      if (role === "SUPER_ADMIN") {
        return Response.redirect(new URL("/admin", req.nextUrl))
      }

      return Response.redirect(new URL("/tpo", req.nextUrl))
    }

    if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
      return Response.redirect(new URL("/tpo", req.nextUrl))
    }

    if (pathname.startsWith("/tpo") && role !== "TPO_ADMIN" && role !== "TPO_STAFF") {
      return Response.redirect(new URL("/admin", req.nextUrl))
    }
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
