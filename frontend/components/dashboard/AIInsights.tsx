"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type Insight = {
  id: string;
  categorie: string;
  severite: "info" | "attention" | "critique";
  titre: string;
  message: string;
};

function getIcon(severite: Insight["severite"]) {
  if (severite === "critique") return <AlertTriangle size={20} className="text-red-400" />;
  if (severite === "attention") return <Lightbulb size={20} className="text-amber-400" />;
  return <TrendingUp size={20} className="text-green-400" />;
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "Moyen";
  return "À améliorer";
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/ai/insights").then((r) => r.json()),
      fetch("/api/ai/dashboard-summary").then((r) => r.json()),
    ])
      .then(([insightsData, summaryData]) => {
        if (insightsData.error) throw new Error(insightsData.error);
        if (summaryData.error) throw new Error(summaryData.error);
        setInsights(insightsData.insights.slice(0, 3)); // top 3 seulement, aperçu compact
        setScore(summaryData.businessScore);
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-2">
            <Brain size={22} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Business Assistant</h2>
            <p className="text-xs text-white/40">Analyse intelligente de votre activité</p>
          </div>
        </div>
        <Sparkles size={20} className="text-violet-300" />
      </div>

      {chargement ? (
        <div className="flex items-center gap-2 text-white/50 text-sm py-6 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Analyse en cours...
        </div>
      ) : erreur ? (
        <p className="text-sm text-red-300">{erreur}</p>
      ) : (
        <>
          {/* SCORE */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-violet-400" />
                <span className="text-sm text-white/40">Business Score</span>
              </div>
              <span className="font-bold text-white">{score}/100</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-white/40">
              Statut : <span className="ml-1 font-medium text-white">{getScoreLabel(score ?? 0)}</span>
            </p>
          </div>

          {/* TOP 3 INSIGHTS RÉELS */}
          <div className="space-y-4">
            {insights.length === 0 ? (
              <p className="text-sm text-white/40">Aucune alerte — tout est sous contrôle.</p>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
                >
                  <div className="flex gap-3">
                    <div className="mt-1">{getIcon(insight.severite)}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">{insight.titre}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/ai-command-center"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            Voir l'analyse complète →
          </Link>
        </>
      )}
    </div>
  );
}
