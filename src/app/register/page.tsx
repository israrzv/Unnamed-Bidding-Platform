import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";
import { GoogleButton, OAuthError } from "@/components/GoogleButton";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-slate-400">
        You need an account to place a bid.
      </p>

      <div className="mt-6 space-y-4">
        <OAuthError code={error} />
        <GoogleButton label="Sign up with Google" />
        <Divider />
        <RegisterForm />
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-light hover:underline">
          Log in
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
