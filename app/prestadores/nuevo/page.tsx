import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
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

  const [categories, owned] = await Promise.all([
    getCategories(),
    prisma.provider.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <ProviderForm
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      defaultOwn={origen === "propio"}
      alreadyOwned={owned}
    />
  );
}
