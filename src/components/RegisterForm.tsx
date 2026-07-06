"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = String(form.get("username"));
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        // Used by the DB trigger to seed the profile username.
        data: { user_name: username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is required, there is no active session yet.
    if (data.session) {
      router.push("/bid");
      router.refresh();
    } else {
      setNotice("Check your email to confirm your account, then log in.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <Field label="Username" name="username" type="text" autoComplete="username" />
      <Field label="Password" name="password" type="password" autoComplete="new-password" />

      {error && <p className="text-sm text-red-400">{error}</p>}
      {notice && <p className="text-sm text-emerald-400">{notice}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all hover:bg-brand-dark hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required
        minLength={type === "password" ? 8 : undefined}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-brand"
      />
    </label>
  );
}
