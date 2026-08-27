import { Star } from "lucide-react";
import { cn, formatRating } from "@/lib/utils";

export function RatingBadge({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  if (!count) {
    return (
      <span className={cn("text-xs text-carbon/50", className)}>Sin notas aún</span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[#FFF4D6] px-2 py-0.5 text-xs font-semibold text-carbon",
        className,
      )}
    >
      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
      {formatRating(value)}
      {typeof count === "number" && (
        <span className="font-medium text-carbon/60">({count})</span>
      )}
    </span>
  );
}
