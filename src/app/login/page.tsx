import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { GoogleButton, OAuthError } from "@/components/GoogleButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-400">Log in to manage your bid.</p>

      <div className="mt-6 space-y-4">
        <OAuthError code={error} />
        <GoogleButton label="Continue with Google" />
        <Divider />
        <LoginForm />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        New here?{" "}
        <Link href="/register" className="text-brand-light hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-800" />
      <span className="text-xs uppercase tracking-wide text-slate-500">or</span>
      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}
