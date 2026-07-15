"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS: { href: string; label: string; badge?: string }[] = [
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
        <Link href="/" aria-label="BidFair home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm transition-colors ${
                isActive(pathname, link.href) ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
              {isActive(pathname, link.href) && (
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-emerald-400" />
              )}
              {link.badge && (
                <span className="ml-1.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {initials ? (
        <div className="flex items-center gap-4">
          <SignOutButton className="hidden text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-50 sm:block" />
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/90 text-xs font-semibold text-zinc-950 transition-transform hover:scale-105"
            aria-label="Your profile"
          >
            {initials}
          </Link>
        </div>
      ) : (
        <Link
          href="/signin"
          className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white"
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
