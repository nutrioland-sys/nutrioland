import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/server/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthed = await verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthed) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/categories") ||
    pathname.startsWith("/api/announcement") ||
    pathname.startsWith("/api/analytics") ||
    pathname.startsWith("/api/hero")
  ) {
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/orders")) {
    // Checkout needs to create orders without an admin session; everything
    // else (listing all orders, editing them) is admin-only.
    const isPublicOrderCreation = pathname === "/api/orders" && request.method === "POST";
    if (!isPublicOrderCreation && !isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/orders/:path*",
    "/api/categories/:path*",
    "/api/announcement/:path*",
    "/api/analytics/:path*",
    "/api/hero/:path*",
  ],
};
