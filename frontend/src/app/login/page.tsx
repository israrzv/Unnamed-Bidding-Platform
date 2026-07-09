import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthWall } from "@/components/AuthWall";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-2">
      <AuthWall initialError={error} />
    </div>
  );
}
