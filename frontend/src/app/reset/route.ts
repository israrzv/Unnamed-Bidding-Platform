import { NextResponse } from "next/server";

/**
 * Dev/UX helper: clears the guest cookie and any Supabase auth cookies, then
 * drops you back on the login page. Visit /reset to see the first-time flow.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(new URL("/login", url.origin));

  // Kill the "enter as guest" bypass cookie.
  res.cookies.set("bidfair-guest", "", { path: "/", maxAge: 0 });

  // Expire any Supabase auth cookies (sb-*) so a real session is signed out too.
  const cookieHeader = request.headers.get("cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (name && name.startsWith("sb-")) {
      res.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
  }

  return res;
}
