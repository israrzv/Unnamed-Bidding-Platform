"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ParticleTextEffect } from "@/components/ui/interactive-text-particle";
import { StripesBackground } from "@/components/StripesBackground";
import { RainbowBackground } from "@/components/RainbowBackground";

const AUTH_ERRORS: Record<string, string> = {
  auth_failed: "Sign-in failed. Please try again.",
  google_not_configured: "Google sign-in isn't enabled in Supabase yet.",
};

export function LoginExperience({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(
    initialError ? AUTH_ERRORS[initialError] ?? "Something went wrong." : null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const showRest = email.trim().length > 0;

  // Slide the whole page out to the left, then navigate — smooth hand-off to
  // the intro splash / app instead of a hard cut.
  function leave(go: () => void) {
    setExiting(true);
    setTimeout(go, 450);
  }

  async function signInWithGoogle() {
    setError(null);
    // Go straight to Google — no pre-redirect animation.
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  function enterAsGuest() {
    document.cookie = `bidfair-guest=1; path=/; max-age=${60 * 60 * 24 * 7}`;
    leave(() => router.push("/"));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      leave(() => {
        router.push("/");
        router.refresh();
      });
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
      leave(() => {
        router.push("/");
        router.refresh();
      });
    } else {
      setNotice("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        exiting ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {mode === "login" ? <StripesBackground /> : <RainbowBackground />}

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
        {/* Interactive particle title */}
        <div className="h-56 w-full max-w-4xl sm:h-72">
          <ParticleTextEffect
            text="BIDFAIR"
            colors={["34d399", "22d3ee", "60a5fa", "818cf8", "a78bfa"]}
            particleDensity={4}
            className="h-full w-full animate-hue"
          />
        </div>

        {/* Minimal auth — no box */}
        <div className="mt-10 w-full max-w-xs space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-lg border border-zinc-700/70 bg-zinc-950/40 px-4 py-2.5 text-white placeholder:text-zinc-500 outline-none backdrop-blur-sm focus:border-emerald-400/60"
            />

            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ${
                showRest ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {mode === "signup" && (
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  required={showRest}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-zinc-700/70 bg-zinc-950/40 px-4 py-2.5 text-white placeholder:text-zinc-500 outline-none backdrop-blur-sm focus:border-emerald-400/60"
                />
              )}
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "signup" ? 8 : undefined}
                required={showRest}
                suppressHydrationWarning
                className="w-full rounded-lg border border-zinc-700/70 bg-zinc-950/40 px-4 py-2.5 text-white placeholder:text-zinc-500 outline-none backdrop-blur-sm focus:border-emerald-400/60"
              />
            </div>

            {error && <p className="text-sm text-rose-400">{error}</p>}
            {notice && <p className="text-sm text-emerald-400">{notice}</p>}

            <button
              type="submit"
              disabled={loading || !showRest}
              className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-white disabled:opacity-40"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700/70 bg-zinc-950/40 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-zinc-900/60 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center justify-center gap-4 pt-1 text-sm">
            <button
              type="button"
              onClick={enterAsGuest}
              className="text-zinc-400 transition-colors hover:text-white"
            >
              Enter as guest
            </button>
            <span className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
                setNotice(null);
              }}
              className="font-medium text-emerald-400 transition-colors hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
