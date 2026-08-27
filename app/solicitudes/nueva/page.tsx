import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RequestForm } from "@/components/forms/RequestForm";
import { getCategories } from "@/lib/queries";

export default async function NuevaSolicitudPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/solicitudes/nueva");
  const categories = await getCategories();
  return (
    <RequestForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
  );
}
