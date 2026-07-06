import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function NavBar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Bid<span className="text-brand">Fair</span>
        </Link>

        <div className="flex items-center gap-1 text-sm">
          <Link href="/" className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
            Home
          </Link>
          <Link href="/bid" className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
            Bid
          </Link>
          <Link href="/leaderboard" className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                {user.username}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand px-3 py-2 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
