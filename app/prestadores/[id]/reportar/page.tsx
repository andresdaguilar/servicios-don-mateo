import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReportForm } from "@/components/forms/ReportForm";

export default async function ReportarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;
  return <ReportForm providerId={id} />;
}
