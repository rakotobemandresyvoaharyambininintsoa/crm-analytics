"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Users, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type ResumeData = {
  businessScore: number;
  resume: string;
  ventesCe30j: number;
  nouveauxClientsCe30j: number;
  facturesEnRetard: number;
  produitsSousAlerte: number;
};

export default function AISummary() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ai/dashboard-summary")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((e) => setErreur(e.message));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-slate-900 to-blue-500/10 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-violet-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Executive Summary</h2>
          <p className="text-sm text-white/50">Analyse automatique de votre entreprise</p>
        </div>
      </div>

      {erreur ? (
        <p className="text-sm text-red-300">{erreur}</p>
      ) : !data ? (
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Génération du résumé en cours...
        </div>
      ) : (
        <>
          <p className="text-white/80 leading-8 text-[15px]">{data.resume}</p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <TrendingUp className="h-7 w-7 text-emerald-400 mb-3" />
              <h3 className="text-white font-semibold">CA encaissé (30j)</h3>
              <p className="text-white/50 mt-2 text-sm">
                {data.ventesCe30j.toLocaleString("fr-FR")} MGA sur les 30 derniers jours.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Users className="h-7 w-7 text-blue-400 mb-3" />
              <h3 className="text-white font-semibold">Nouveaux clients</h3>
              <p className="text-white/50 mt-2 text-sm">
                {data.nouveauxClientsCe30j} nouveaux clients ces 30 derniers jours.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <AlertTriangle className="h-7 w-7 text-amber-400 mb-3" />
              <h3 className="text-white font-semibold">Attention</h3>
              <p className="text-white/50 mt-2 text-sm">
                {data.facturesEnRetard} facture(s) en retard, {data.produitsSousAlerte} produit(s) sous seuil.
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
