import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { CategoryGlyph } from "@/components/ui/CategoryGlyph";
import type { ProviderCardModel } from "@/lib/queries";

export function ProviderCard({ provider }: { provider: ProviderCardModel }) {
  const category = provider.categories[0]?.category;
  const photo = provider.photos[0]?.url;

  return (
    <Link
      href={`/prestadores/${provider.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 shadow-[0_1px_2px_rgba(31,31,31,0.04)] ring-1 ring-black/[0.04]"
    >
      <div className="relative">
        <Avatar name={provider.name} src={photo} />
        {category && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
            <CategoryGlyph icon={category.icon} className="h-3 w-3" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-[15px] text-carbon">{provider.name}</p>
          <RatingBadge value={provider.stats.avg} count={provider.stats.count} />
        </div>
        <p className="mt-0.5 text-[13px] text-carbon/70">
          {provider.stats.count > 0
            ? `${provider.stats.count} vecinos lo recomiendan`
            : "Todavía sin recomendaciones"}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-carbon/50">
          <MapPin className="h-3 w-3" />
          {provider.zone}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-carbon/30" />
    </Link>
  );
}
