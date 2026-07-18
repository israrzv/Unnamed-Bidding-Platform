"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Trophy } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/events", label: "Events", Icon: CalendarDays },
  { href: "/arena", label: "Arenas", Icon: Trophy },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SidebarLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 px-3">
      {LINKS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-emerald-400" : ""}`} />
            {label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </Link>
        );
      })}
    </nav>
  );
}
