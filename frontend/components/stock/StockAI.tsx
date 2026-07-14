"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Loader2,
  AlertTriangle,
  Package,
  TrendingUp,
  Wallet,
  RefreshCw,
  ShieldAlert,
  Target,
  Lightbulb,
} from "lucide-react";

type AnalyseStockIA = {
  resume: string;
  risques: string[];
  opportunites: string[];
  actions_prioritaires: string[];
  confidence: number;
};

type StockAIResponse = {
  healthScore: number;
  produitsCritiques: { id: number; nom: string; quantite: number }[];
  produitsDormants: { id: number; nom: string; quantite: number }[];
  valeurStock: number;
  analyse: AnalyseStockIA;
};

function InfoCard({
  icon,
  titre,
  valeur,
}: {
  icon: React.ReactNode;
  titre: string;
  valeur: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <span className="text-sm text-white/40">{titre}</span>
      </div>
      <h2 className="text-2xl font-bold text-white">{valeur}</h2>
    </div>
  );
}

function ListeAvecPuces({
  titre,
  items,
  icon,
  accent,
}: {
  titre: string;
  items: string[];
  icon: React.ReactNode;
  accent: "red" | "violet" | "emerald";
}) {
  const styles = {
    red: "border-red-500/20 bg-red-500/[0.04] text-red-300",
    violet: "border-violet-500/20 bg-violet-500/[0.04] text-violet-300",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-300",
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`rounded-xl border p-5 ${styles[accent]}`}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {titre}
      </div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StockAI() {
  const [data, setData] = useState<StockAIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    charger(controller.signal);
    return () => controller.abort();
  }, []);

  async function charger(signal?: AbortSignal) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/ai/stock", { cache: "no-store", signal });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error?.message || json?.error || "Erreur de chargement");
      }

      setData(json);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          Analyse IA du stock...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => charger()}
          className="mt-3 inline-flex items-center gap-2 text-sm text-red-200 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/50">
        Aucune donnée disponible.
      </div>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-3">
          <Brain className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Stock Intelligence Center</h2>
          <p className="text-sm text-white/40">Analyse intelligente de votre inventaire</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <InfoCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          titre="Health Score"
          valeur={`${data.healthScore}/100`}
        />
        <InfoCard
          icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
          titre="Produits critiques"
          valeur={data.produitsCritiques.length}
        />
        <InfoCard
          icon={<Package className="h-5 w-5 text-amber-400" />}
          titre="Produits dormants (90j+)"
          valeur={data.produitsDormants.length}
        />
        <InfoCard
          icon={<Wallet className="h-5 w-5 text-sky-400" />}
          titre="Valeur stock"
          valeur={`${Number(data.valeurStock).toLocaleString()} Ar`}
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Analyse Gemma</h3>
            {typeof data.analyse.confidence === "number" && (
              <span className="rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-300">
                Confiance : {data.analyse.confidence}%
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap leading-7 text-white/70 text-sm">
            {data.analyse.resume || "Aucun résumé disponible."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ListeAvecPuces
            titre="Risques"
            items={data.analyse.risques}
            icon={<ShieldAlert size={16} />}
            accent="red"
          />
          <ListeAvecPuces
            titre="Actions prioritaires"
            items={data.analyse.actions_prioritaires}
            icon={<Target size={16} />}
            accent="violet"
          />
          <ListeAvecPuces
            titre="Opportunités"
            items={data.analyse.opportunites}
            icon={<Lightbulb size={16} />}
            accent="emerald"
          />
        </div>
      </div>
    </div>
  );
}
