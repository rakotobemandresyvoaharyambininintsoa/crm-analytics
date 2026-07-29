/**
 * Shared color scheme for dashboard cards/widgets.
 *
 * Centralized here so future components reuse this palette instead of
 * re-declaring their own copy (the previous audit flagged this exact
 * pattern duplicated across dashboard components).
 */
export type DashboardColor = "blue" | "green" | "purple" | "orange" | "red";

export interface ColorTokens {
  bg: string;
  ring: string;
  icon: string;
  progress: string;
}

export const DASHBOARD_COLORS: Record<DashboardColor, ColorTokens> = {
  blue: {
    bg: "from-blue-500/20 to-cyan-500/10",
    ring: "border-blue-500/20",
    icon: "bg-blue-500/20 text-blue-400",
    progress: "from-blue-500 to-cyan-500",
  },
  green: {
    bg: "from-emerald-500/20 to-green-500/10",
    ring: "border-emerald-500/20",
    icon: "bg-emerald-500/20 text-emerald-400",
    progress: "from-emerald-500 to-green-500",
  },
  purple: {
    bg: "from-violet-500/20 to-indigo-500/10",
    ring: "border-violet-500/20",
    icon: "bg-violet-500/20 text-violet-400",
    progress: "from-violet-500 to-indigo-500",
  },
  orange: {
    bg: "from-orange-500/20 to-amber-500/10",
    ring: "border-orange-500/20",
    icon: "bg-orange-500/20 text-orange-400",
    progress: "from-orange-500 to-amber-500",
  },
  red: {
    bg: "from-red-500/20 to-pink-500/10",
    ring: "border-red-500/20",
    icon: "bg-red-500/20 text-red-400",
    progress: "from-red-500 to-pink-500",
  },
};
