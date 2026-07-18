import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import { SidebarLinks } from "@/components/SidebarLinks";
import { MobileNavLinks } from "@/components/NavMenu";
import { SignOutButton } from "@/components/SignOutButton";

function initialsFrom(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export async function Sidebar() {
  const user = await getCurrentUser();
  const initials = user ? initialsFrom(user.username || user.email || "user") : null;

  return (
    <>
      {/* Desktop vertical rail — pure black */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-800/80 bg-black md:flex">
        <div className="px-6 py-6">
          <Link href="/" aria-label="BidFair home">
            <Logo />
          </Link>
        </div>

        <SidebarLinks />

        <div className="mt-auto border-t border-zinc-800/80 p-4">
          {initials ? (
            <div className="flex items-center justify-between">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/90 text-xs font-semibold text-zinc-950">
                  {initials}
                </span>
                Account
              </Link>
              <SignOutButton className="text-xs text-zinc-500 transition-colors hover:text-white disabled:opacity-50" />
            </div>
          ) : (
            <Link
              href="/signin"
              className="block rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-black md:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" aria-label="BidFair home">
            <Logo />
          </Link>
          {initials ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/90 text-xs font-semibold text-zinc-950"
              aria-label="Your profile"
            >
              {initials}
            </Link>
          ) : (
            <Link
              href="/signin"
              className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-semibold text-zinc-200"
            >
              Sign in
            </Link>
          )}
        </div>
        <MobileNavLinks />
      </header>
    </>
  );
}
