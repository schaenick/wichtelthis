export type Theme = "neutral" | "weihnachten" | "party" | "rosa";

export const themes: Record<Theme, {
  label: string;
  emoji: string;
  bg: string;
  card: string;
  border: string;
  accent: string;
  accentHover: string;
  accentText: string;
  badge: string;
  badgeText: string;
  highlight: string;
}> = {
  neutral: {
    label: "Neutral",
    emoji: "🤍",
    bg: "bg-stone-50",
    card: "bg-white",
    border: "border-stone-200",
    accent: "bg-stone-800",
    accentHover: "hover:bg-stone-700",
    accentText: "text-white",
    badge: "bg-stone-100",
    badgeText: "text-stone-600",
    highlight: "bg-stone-50",
  },
  weihnachten: {
    label: "Weihnachten",
    emoji: "🎄",
    bg: "bg-[#f5f0e8]",
    card: "bg-white",
    border: "border-[#c8a96e]",
    accent: "bg-[#2d6a4f]",
    accentHover: "hover:bg-[#1b4332]",
    accentText: "text-white",
    badge: "bg-[#2d6a4f]",
    badgeText: "text-white",
    highlight: "bg-[#fff8ed]",
  },
  party: {
    label: "Party",
    emoji: "🎉",
    bg: "bg-[#f3f0ff]",
    card: "bg-white",
    border: "border-[#c4b5fd]",
    accent: "bg-[#7c3aed]",
    accentHover: "hover:bg-[#6d28d9]",
    accentText: "text-white",
    badge: "bg-[#7c3aed]",
    badgeText: "text-white",
    highlight: "bg-[#faf5ff]",
  },
  rosa: {
    label: "Rosa",
    emoji: "🌸",
    bg: "bg-[#fff0f5]",
    card: "bg-white",
    border: "border-[#f9a8d4]",
    accent: "bg-[#db2777]",
    accentHover: "hover:bg-[#be185d]",
    accentText: "text-white",
    badge: "bg-[#fce7f3]",
    badgeText: "text-[#9d174d]",
    highlight: "bg-[#fff0f5]",
  },
};