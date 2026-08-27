import {
  Anvil,
  Bike,
  Building2,
  Car,
  Cog,
  Cross,
  Ellipsis,
  Flame,
  Flower2,
  GraduationCap,
  Hammer,
  HeartPulse,
  KeyRound,
  Paintbrush,
  PawPrint,
  Shield,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  wrench: Wrench,
  zap: Zap,
  bike: Bike,
  car: Car,
  cog: Cog,
  anvil: Anvil,
  paintbrush: Paintbrush,
  "flower-2": Flower2,
  hammer: Hammer,
  sparkles: Sparkles,
  "key-round": KeyRound,
  "paw-print": PawPrint,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  cross: Cross,
  shield: Shield,
  "building-2": Building2,
  ellipsis: Ellipsis,
};

export function CategoryGlyph({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = ICONS[icon] ?? Ellipsis;
  return <Icon className={cn("h-5 w-5", className)} strokeWidth={1.75} />;
}
