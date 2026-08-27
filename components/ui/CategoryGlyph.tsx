import {
  Bike,
  Building2,
  Cross,
  Ellipsis,
  Flame,
  Flower2,
  GraduationCap,
  Hammer,
  HeartPulse,
  KeyRound,
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
