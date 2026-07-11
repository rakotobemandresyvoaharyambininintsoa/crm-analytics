"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

interface StatCardProps {
  titre: string;
  valeur: string | number;
  icone: ReactNode;

  evolution?: number;
  objectif?: number;
  insight?: string;

  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const COLORS = {
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

export default function StatCard({
  titre,
  valeur,
  icone,

  // Pas de valeurs par défaut inventées : si le parent ne fournit pas de
  // données réelles, on l'affiche clairement plutôt que d'afficher un chiffre
  // qui a l'air vrai mais qui ne l'est pas.
  evolution,
  objectif,
  insight,

  color = "purple",
}: StatCardProps) {
  const c = COLORS[color];

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`relative overflow-hidden rounded-3xl border ${c.ring} bg-gradient-to-br ${c.bg} p-6`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider text-white/40">
              {titre}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {valeur}
            </h2>

          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.icon}`}
          >
            {icone}
          </div>

        </div>

        {evolution !== undefined && (
          <div className="mt-6 flex items-center gap-2">
            {evolution >= 0 ? (
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}

            <span
              className={`font-semibold ${
                evolution >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {evolution >= 0 ? "+" : ""}
              {evolution}%
            </span>

            <span className="text-white/40 text-sm">ce mois</span>
          </div>
        )}

        {objectif !== undefined && (
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Objectif</span>
              <span>{objectif}%</span>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${c.progress}`}
                style={{
                  width: `${Math.min(100, Math.max(0, objectif))}%`,
                }}
              />
            </div>
          </div>
        )}

        {insight && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="text-xs uppercase tracking-wide text-violet-300">
                Insight
              </span>
            </div>

            <p className="mt-2 text-sm text-white/70">{insight}</p>
          </div>
        )}

      </div>
    </motion.div>
  );
}