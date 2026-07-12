"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/arena", label: "Arenas" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavMenu({ initials }: { initials: string | null }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Bid<span className="text-zinc-500">Fair</span>
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                isActive(pathname, link.href) ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {initials ? (
        <div className="flex items-center gap-4">
          <SignOutButton className="hidden text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-50 sm:block" />
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-900 transition-transform hover:scale-105"
            aria-label="Your vault"
          >
            {initials}
          </Link>
        </div>
      ) : (
        <Link
          href="/signin"
          className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white"
        >
          Sign in
        </Link>
      )}
    </>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-5 border-t border-zinc-800/80 px-6 py-2.5 sm:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition-colors ${
            isActive(pathname, link.href) ? "text-white" : "text-zinc-400"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
