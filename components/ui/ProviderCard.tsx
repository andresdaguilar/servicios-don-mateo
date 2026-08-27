import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { CategoryGlyph } from "@/components/ui/CategoryGlyph";
import type { ProviderCardModel } from "@/lib/queries";

export function ProviderCard({ provider }: { provider: ProviderCardModel }) {
  const photo = provider.photos[0]?.url;
  const categories = provider.categories.map((c) => c.category);

  return (
    <Link
      href={`/prestadores/${provider.id}`}
      className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 shadow-[0_1px_2px_rgba(31,31,31,0.04)] ring-1 ring-line"
    >
      <Avatar name={provider.name} src={photo} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-[15px] text-carbon">{provider.name}</p>
          <RatingBadge value={provider.stats.avg} count={provider.stats.count} />
        </div>
        {categories.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[12px] font-semibold text-brand-ink"
              >
                <CategoryGlyph icon={category.icon} className="h-3.5 w-3.5" />
                {category.name}
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-[13px] text-carbon/70">
          {provider.stats.count > 0
            ? `${provider.stats.count} vecinos lo recomiendan`
            : "Todavía sin recomendaciones"}
        </p>
        {provider.zone ? (
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-carbon/50">
            <MapPin className="h-3 w-3" />
            {provider.zone}
          </p>
        ) : null}
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-carbon/30" />
    </Link>
  );
}
