import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

/**
 * Returns the logged-in user merged with their public profile, or null.
 * Uses supabase.auth.getUser() which validates the session with the server.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    username: profile?.username ?? user.email?.split("@")[0] ?? "user",
    avatarUrl: profile?.avatar_url ?? null,
    createdAt: profile?.created_at ?? user.created_at,
  };
}
