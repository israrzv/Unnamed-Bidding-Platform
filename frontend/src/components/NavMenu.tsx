"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/bidding", label: "Bidding" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavMenu({ initials }: { initials: string | null }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Bid<span className="text-violet-400">Fair</span>
        </Link>
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-zinc-800/80 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {initials ? (
        <div className="flex items-center gap-3">
          <SignOutButton
            className="hidden text-sm font-medium text-zinc-500 transition-colors hover:text-white disabled:opacity-50 sm:block"
          />
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white ring-2 ring-violet-500/30 transition-transform hover:scale-105"
            aria-label="Your profile"
          >
            {initials}
          </Link>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300 hover:bg-violet-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
        >
          Sign Up / Log In
        </Link>
      )}
    </>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 border-t border-zinc-800/60 px-4 py-2 sm:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex-1 rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors ${
            isActive(pathname, link.href) ? "bg-zinc-800/80 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
