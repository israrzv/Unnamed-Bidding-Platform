"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AUTH_ERRORS: Record<string, string> = {
  auth_failed: "Sign-in failed. Please try again.",
  google_not_configured: "Google sign-in isn't enabled in Supabase yet.",
};

export function AuthWall({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(
    initialError ? AUTH_ERRORS[initialError] ?? "Something went wrong." : null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setError(null);
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/");
      router.refresh();
      return;
    }

    const username = String(form.get("username"));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { user_name: username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setNotice("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === "login" ? "Sign in to manage your pledges." : "Sign up to enter the arena."}
        </p>
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-900 disabled:opacity-60"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-xs uppercase tracking-widest text-zinc-600">or</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <Input name="username" type="text" placeholder="Username" autoComplete="username" />
        )}
        <Input name="email" type="email" placeholder="Email" autoComplete="email" />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "signup" ? 8 : undefined}
        />

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {notice && <p className="text-sm text-emerald-400">{notice}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-40"
        >
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-400">
        {mode === "login" ? "New to BidFair?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setNotice(null);
          }}
          className="font-medium text-zinc-100 hover:underline"
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      required
      suppressHydrationWarning
      className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600"
    />
  );
}
