import Link from "next/link";
import { redirect } from "next/navigation";
import { isValidInviteCode } from "@/lib/invite";

export default async function UnirsePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (isValidInviteCode(code)) {
    redirect(`/registro?invite=${encodeURIComponent(code.trim().toUpperCase())}`);
  }

  return (
          <div className="px-5 pt-6">
        <h1 className="font-serif text-2xl font-semibold">Link inválido</h1>
        <p className="mt-2 text-sm text-carbon/65">
          Este no es el link de invitación del grupo. Pedilo de nuevo o usá el código.
        </p>
        <Link href="/registro" className="mt-6 inline-block font-semibold text-brand-ink">
          Ir al registro
        </Link>
      </div>
  );
}
