import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  pending: "bg-[#FFF4D6] text-[#8A6200]",
  reported: "bg-[#FFE8E7] text-coral",
  approved: "bg-brand-soft text-brand-ink",
  rejected: "bg-[#FFE8E7] text-coral",
  hidden: "bg-mist text-carbon/70",
  outdated: "bg-mist text-carbon/70",
  duplicate: "bg-mist text-carbon/70",
};

const LABELS: Record<string, string> = {
  pending: "Pendiente",
  reported: "Revisar",
  approved: "Aprobado",
  rejected: "Rechazado",
  hidden: "Oculto",
  outdated: "Desactualizado",
  duplicate: "Duplicado",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        STYLES[status] ?? "bg-mist",
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
