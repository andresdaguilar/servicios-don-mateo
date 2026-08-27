import { notFound } from "next/navigation";
import { RecommendForm } from "@/components/forms/RecommendForm";
import { getProviderById } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RecomendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const provider = await getProviderById(id);
  if (!provider) notFound();
  return <RecommendForm providerId={provider.id} providerName={provider.name} />;
}
