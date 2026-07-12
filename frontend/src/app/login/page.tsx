import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginExperience } from "@/components/LoginExperience";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const { error } = await searchParams;

  return <LoginExperience initialError={error} />;
}
