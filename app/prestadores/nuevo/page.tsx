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
  const { origen } = await searchParams;
  if (!session?.user) {
    const next =
      origen === "propio" ? "/prestadores/nuevo?origen=propio" : "/prestadores/nuevo";
    redirect(`/login?from=${encodeURIComponent(next)}`);
  }

  const categories = await getCategories();

  return (
    <ProviderForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      defaultOwn={origen === "propio"}
    />
  );
}
