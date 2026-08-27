import { RegisterForm } from "@/components/forms/RegisterForm";
import { isValidInviteCode } from "@/lib/invite";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const { invite } = await searchParams;
  const inviteCode = isValidInviteCode(invite) ? invite!.trim().toUpperCase() : undefined;
  return <RegisterForm inviteCode={inviteCode} />;
}
