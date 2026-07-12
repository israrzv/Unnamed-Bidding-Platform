import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SignInForm } from "@/components/SignInForm";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const { error } = await searchParams;

  return <SignInForm initialError={error} />;
}
