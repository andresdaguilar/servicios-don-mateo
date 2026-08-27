import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReportForm } from "@/components/forms/ReportForm";

export default async function ReportarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) redirect(`/login?from=/prestadores/${id}/reportar`);
  return <ReportForm providerId={id} />;
}
