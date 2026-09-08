import {
  Code2,
  Database,
  Palette,
  Megaphone,
  Languages as LanguagesIcon,
  Briefcase,
  ListChecks,
  HeartPulse,
  Music2,
  Scissors,
  Cog,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/**
 * One thin-line icon per category — a scannable cue next to the name,
 * not decoration. Matches the catalog's restrained visual language: no
 * fill, no color, just the ink/muted tone already used for labels.
 */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  programming: Code2,
  "data-ai": Database,
  design: Palette,
  marketing: Megaphone,
  languages: LanguagesIcon,
  business: Briefcase,
  productivity: ListChecks,
  wellness: HeartPulse,
  music: Music2,
  crafts: Scissors,
  engineering: Cog,
  education: GraduationCap,
};
