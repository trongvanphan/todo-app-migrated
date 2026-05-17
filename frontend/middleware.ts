import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Unauthenticated users trying to access /tasks → redirect to /
  if (!isLoggedIn && pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Authenticated users on sign-in page → redirect to /tasks
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }
});

export const config = {
  matcher: ["/", "/tasks/:path*"],
};
