"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function CategorySelect({
  categories,
  value,
  q,
}: {
  categories: { slug: string; name: string }[];
  value?: string;
  q?: string;
}) {
  const router = useRouter();

  function onChange(slug: string) {
    const params = new URLSearchParams();
    if (slug) params.set("rubro", slug);
    if (q?.trim()) params.set("q", q.trim());
    router.push(`/buscar${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <label className="relative block">
      <span className="sr-only">Categoría</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl bg-mist px-3.5 py-3 pr-10 text-[15px] text-carbon outline-none"
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-carbon/45"
        strokeWidth={1.75}
      />
    </label>
  );
}
