import { getCurrentUser } from "@/lib/auth";
import { NavMenu, MobileNavLinks } from "@/components/NavMenu";

function initialsFrom(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export async function Navbar() {
  const user = await getCurrentUser();
  const initials = user ? initialsFrom(user.username || user.email || "user") : null;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <nav className="flex items-center justify-between px-6 py-4 sm:px-10">
        <NavMenu initials={initials} />
      </nav>
      <MobileNavLinks />
    </header>
  );
}
