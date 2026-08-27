import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProviderForm } from "@/components/forms/ProviderForm";
import { getCategories } from "@/lib/queries";

export default async function NuevoPrestadorPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/prestadores/nuevo");
  const { origen } = await searchParams;
  const categories = await getCategories();
  const source = origen === "vecino" ? "neighbor" : "self";
  return (
    <ProviderForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      source={source}
    />
  );
}
