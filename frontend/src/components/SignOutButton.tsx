"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({
  className = "",
  label = "Log out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={signOut} disabled={loading} className={className}>
      {loading ? "Logging out…" : label}
    </button>
  );
}
