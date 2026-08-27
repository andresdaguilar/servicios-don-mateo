import { ChevronDown } from "lucide-react";
import { FAQ_SECTIONS } from "@/lib/faq";

export function FaqList() {
  return (
    <div className="flex flex-col gap-5">
      {FAQ_SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 px-1 text-sm font-semibold text-carbon">{section.title}</h2>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04]">
            {section.items.map((item) => (
              <details
                key={item.q}
                className="group border-b border-black/[0.04] last:border-0"
              >
                <summary className="flex list-none items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-medium text-carbon marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-carbon/40 transition-transform group-open:rotate-180"
                    strokeWidth={1.75}
                  />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-carbon/65">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
