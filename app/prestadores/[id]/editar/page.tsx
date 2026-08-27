import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { EditProviderForm } from "@/components/forms/EditProviderForm";
import { getCategories, getProviderById } from "@/lib/queries";
import { canEditProvider } from "@/lib/permissions";
import { listingPhotos } from "@/lib/photos";

export default async function EditarPrestadorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    const { id } = await params;
    redirect(`/login?from=${encodeURIComponent(`/prestadores/${id}/editar`)}`);
  }

  const { id } = await params;
  const [provider, categories] = await Promise.all([
    getProviderById(id),
    getCategories(),
  ]);
  if (!provider) notFound();
  if (!canEditProvider(session.user, provider)) notFound();
  if (provider.deletedAt) redirect(`/prestadores/${id}`);

  return (
    <EditProviderForm
      providerId={provider.id}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      initial={{
        name: provider.name,
        phone: provider.phone,
        instagram: provider.instagram ?? "",
        website: provider.website ?? "",
        zone: provider.zone,
        license: provider.license ?? "",
        description: provider.description,
        categoryIds: provider.categories.map((c) => c.categoryId),
        avatarUrl: listingPhotos(provider.photos).avatarUrl,
        galleryUrls: listingPhotos(provider.photos).gallery.map((p) => p.url),
      }}
    />
  );
}
