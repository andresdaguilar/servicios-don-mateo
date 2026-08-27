import { LoginForm } from "@/components/forms/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return <LoginForm from={from && from.startsWith("/") ? from : "/"} />;
}
