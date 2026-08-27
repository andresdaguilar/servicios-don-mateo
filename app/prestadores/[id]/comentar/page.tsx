import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { CommentForm } from "@/components/forms/CommentForm";
import { getProviderById } from "@/lib/queries";

export default async function ComentarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { id } = await params;
  const provider = await getProviderById(id);
  if (!provider) notFound();
  return <CommentForm providerId={id} />;
}
