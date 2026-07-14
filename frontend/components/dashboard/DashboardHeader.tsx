"use client";

import { Sparkles, Rocket, CalendarDays, Bell } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  user?: string;
}

export default function DashboardHeader({
  user = "Administrateur",
}: DashboardHeaderProps) {
  const heure = new Date().getHours();

  const salutation =
    heure < 12
      ? "Bonjour"
      : heure < 18
      ? "Bon après-midi"
      : "Bonsoir";

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-8"
    >
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm text-violet-300 mb-5">
            <Sparkles className="h-4 w-4" />
            AI Business Assistant
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            {salutation}, {user}
          </h1>

          <p className="mt-3 max-w-2xl text-white/60 leading-7">
            Votre entreprise est en bonne santé aujourd'hui.
            L'intelligence artificielle a analysé les ventes,
            les clients et le stock afin de vous proposer
            les meilleures décisions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                +18 % de ventes
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
                2 ruptures prévues
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                3 recommandations IA
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:w-[320px]">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                <Rocket className="h-5 w-5 text-violet-400" />
              </div>

              <div>
                <p className="text-xs text-white/40">
                  Objectif mensuel
                </p>

                <p className="text-xl font-bold text-white">
                  78 %
                </p>
              </div>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">

              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />

            </div>
          </div>

          <div className="flex gap-4">

            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

              <CalendarDays className="mb-3 h-5 w-5 text-cyan-400" />

              <p className="text-xs text-white/40">
                Aujourd'hui
              </p>

              <p className="mt-1 font-semibold text-white">
                12 réunions
              </p>

            </div>

            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">

              <Bell className="mb-3 h-5 w-5 text-orange-400" />

              <p className="text-xs text-white/40">
                Alertes
              </p>

              <p className="mt-1 font-semibold text-white">
                5
              </p>

            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
