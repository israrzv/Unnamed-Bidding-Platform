import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { ProfileTabs } from "@/components/ProfileTabs";

export const dynamic = "force-dynamic";

function initialsFrom(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, "").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const displayName = user.username || user.email || "user";
  const initials = initialsFrom(displayName);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-900">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">{displayName}</h1>
            <p className="text-sm text-zinc-400">The Vault</p>
          </div>
        </div>
        <SignOutButton className="rounded-full border border-zinc-800 px-4 py-1.5 text-sm text-zinc-400 transition-colors hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-50" />
      </div>

      <ProfileTabs username={user.username} email={user.email ?? ""} />
    </div>
  );
}
